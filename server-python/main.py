# main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import time
from contextlib import asynccontextmanager

from config import settings, logger, OPENAI_API_KEY
from routes import router
from models import ErrorResponse
from exceptions import AutBotException
from __version__ import __version__
import openai


# Application lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    # Startup
    logger.info(f"🚀 AutBot Server v{__version__} starting up")
    logger.info(f"🔧 Environment: {settings.environment}")
    logger.info(f"🔒 Debug mode: {settings.debug}")
    
    # Initialize OpenAI if key is available
    if OPENAI_API_KEY:
        openai.api_key = OPENAI_API_KEY
        logger.info("✅ OpenAI API key configured")
    else:
        logger.warning("⚠️  OpenAI API key not configured")
    
    yield
    
    # Shutdown
    logger.info("🛑 AutBot Server shutting down")


# Create FastAPI app with enhanced configuration
app = FastAPI(
    title="AutBot Server",
    description="Production-ready interactive resume chatbot for Autumn Fjeld",
    version=__version__,
    debug=settings.debug,
    lifespan=lifespan
)

# CORS configuration based on environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Request correlation ID middleware
@app.middleware("http")
async def add_correlation_id(request: Request, call_next):
    """Add correlation ID to each request for tracking."""
    correlation_id = str(uuid.uuid4())
    request.state.correlation_id = correlation_id
    
    # Time the request
    start_time = time.time()
    
    response = await call_next(request)
    
    # Log request completion
    process_time = time.time() - start_time
    logger.info(
        f"Request completed - {request.method} {request.url.path} - "
        f"Status: {response.status_code} - Time: {process_time:.3f}s - "
        f"Correlation: {correlation_id}"
    )
    
    response.headers["X-Correlation-ID"] = correlation_id
    return response


# Global exception handler
@app.exception_handler(AutBotException)
async def autbot_exception_handler(request: Request, exc: AutBotException):
    """Handle custom AutBot exceptions."""
    correlation_id = getattr(request.state, 'correlation_id', None)
    
    logger.error(
        f"AutBot exception: {exc.message} - Correlation: {correlation_id} - "
        f"Type: {type(exc).__name__} - Details: {exc.details}"
    )
    
    # Map exception types to HTTP status codes
    status_code_map = {
        "InvalidQueryException": 400,
        "RateLimitExceeded": 429,
        "LLMServiceException": 503,
        "ConfigurationError": 500,
        "DocumentLoadingException": 500,
        "VectorStoreException": 500,
    }
    
    status_code = status_code_map.get(type(exc).__name__, 500)
    
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            error=type(exc).__name__,
            message=exc.message,
            details=exc.details,
            correlation_id=correlation_id
        ).dict()
    )


# Global exception handler for unexpected errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    correlation_id = getattr(request.state, 'correlation_id', None)
    
    logger.error(
        f"Unexpected error: {str(exc)} - Correlation: {correlation_id} - "
        f"Type: {type(exc).__name__}",
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="InternalServerError",
            message="An unexpected error occurred. Please try again later.",
            correlation_id=correlation_id
        ).dict()
    )


# Include routes
app.include_router(router)