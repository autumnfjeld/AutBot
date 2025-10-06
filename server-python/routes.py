from fastapi import APIRouter, HTTPException, Request, Depends
from datetime import datetime
import logging

from models import QueryRequest, QueryResponse, HealthCheckResponse
from exceptions import InvalidQueryException, LLMServiceException, ConfigurationError, RateLimitExceeded
from agent import AutBotAgent
from config import settings, OPENAI_API_KEY
from rate_limiter import check_rate_limit
from __version__ import __version__, CHANGELOG

logger = logging.getLogger(__name__)


def get_client_ip(request: Request) -> str:
    """Extract client IP address from request."""
    # Check for forwarded headers first (common in production behind load balancers)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For can contain multiple IPs, take the first one
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to direct connection IP
    return request.client.host


# Initialize agent only if we have the required dependencies
try:
    if OPENAI_API_KEY:
        from llm_engine import query_engine
        agent = AutBotAgent(query_engine)
        logger.info("✅ AutBot Agent initialized with LLM engine")
    else:
        agent = None
        logger.warning("⚠️  AutBot Agent not initialized - OpenAI API key missing")
except Exception as e:
    agent = None
    logger.error(f"❌ Failed to initialize AutBot Agent: {str(e)}")

router = APIRouter()


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Basic health check endpoint."""
    return HealthCheckResponse(
        status="healthy",
        version=__version__,
        timestamp=datetime.utcnow().isoformat(),
        details={
            "environment": settings.environment,
            "llm_available": agent is not None,
            "openai_configured": OPENAI_API_KEY is not None
        }
    )


@router.get("/ready", response_model=HealthCheckResponse)
async def readiness_check():
    """Readiness check endpoint with dependency verification."""
    is_ready = True
    details = {
        "environment": settings.environment,
        "dependencies": {}
    }
    
    # Check OpenAI availability
    if OPENAI_API_KEY:
        details["dependencies"]["openai"] = "configured"
    else:
        details["dependencies"]["openai"] = "missing"
        is_ready = False
    
    # Check agent availability
    if agent:
        details["dependencies"]["agent"] = "initialized"
    else:
        details["dependencies"]["agent"] = "failed"
        is_ready = False
    
    status = "healthy" if is_ready else "unhealthy"
    
    return HealthCheckResponse(
        status=status,
        version=__version__,
        timestamp=datetime.utcnow().isoformat(),
        details=details
    )


@router.get("/api/version")
async def get_version():
    """Get server version information."""
    return {
        "version": __version__,
        "changelog": CHANGELOG,
        "environment": settings.environment
    }


@router.get("/api/test")
async def test(request: Request):
    """Test endpoint with rate limiting."""
    client_ip = get_client_ip(request)
    correlation_id = getattr(request.state, 'correlation_id', 'unknown')
    
    # Apply rate limiting
    try:
        stats = check_rate_limit(
            key=f"test:{client_ip}",
            limit=settings.rate_limit_requests,
            window=settings.rate_limit_window
        )
    except HTTPException as e:
        # Convert to our custom exception for consistent handling
        raise RateLimitExceeded(
            message="Rate limit exceeded for test endpoint",
            details=e.detail
        )
    
    logger.info(f"Test endpoint accessed - IP: {client_ip} - Correlation: {correlation_id}")
    
    return {
        "message": "AutBot Python server is running!",
        "version": __version__,
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat(),
        "correlation_id": correlation_id,
        "rate_limit": stats
    }


@router.post("/api/query", response_model=QueryResponse)
async def query_route(request: Request, req: QueryRequest):
    """
    Process a query through the LLM with comprehensive error handling.
    
    This endpoint is rate-limited and includes proper validation,
    error handling, and monitoring.
    """
    client_ip = get_client_ip(request)
    correlation_id = getattr(request.state, 'correlation_id', 'unknown')
    
    # Apply rate limiting
    try:
        stats = check_rate_limit(
            key=f"query:{client_ip}",
            limit=settings.rate_limit_requests,
            window=settings.rate_limit_window
        )
    except HTTPException as e:
        # Convert to our custom exception for consistent handling
        raise RateLimitExceeded(
            message="Rate limit exceeded for query endpoint",
            details=e.detail
        )
    
    logger.info(
        f"Query received: {req.query[:100]}{'...' if len(req.query) > 100 else ''} - "
        f"IP: {client_ip} - Correlation: {correlation_id}"
    )
    
    # Check if agent is available
    if not agent:
        raise ConfigurationError(
            message="LLM service is not available. Please check server configuration.",
            details={"reason": "Agent not initialized", "openai_key_present": OPENAI_API_KEY is not None}
        )
    
    try:
        # Process the query
        result = await agent.get_response(req.query)
        
        response = QueryResponse(
            response=result["response"],
            context=result.get("context"),
            metadata={
                "correlation_id": correlation_id,
                "timestamp": datetime.utcnow().isoformat(),
                "version": __version__,
                "rate_limit": stats
            }
        )
        
        logger.info(
            f"Query processed successfully - "
            f"Response length: {len(result['response'])} - "
            f"Context chunks: {len(result.get('context', []))} - "
            f"Correlation: {correlation_id}"
        )
        
        return response
        
    except Exception as e:
        logger.error(
            f"Error processing query: {str(e)} - "
            f"Query: {req.query[:100]}{'...' if len(req.query) > 100 else ''} - "
            f"Correlation: {correlation_id}",
            exc_info=True
        )
        
        # Re-raise as LLM service exception for proper handling
        raise LLMServiceException(
            message="Failed to process query. Please try again later.",
            details={
                "correlation_id": correlation_id,
                "original_error": str(e)
            }
        )