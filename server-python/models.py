from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
import re


class QueryRequest(BaseModel):
    """Request model for query endpoint with validation."""
    
    query: str = Field(
        ..., 
        min_length=1, 
        max_length=500,
        description="The query string to send to the LLM"
    )
    
    @validator('query')
    def validate_query(cls, v):
        """Validate and sanitize query input."""
        if not v or not v.strip():
            raise ValueError("Query cannot be empty")
        
        # Remove excessive whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        
        # Basic content filtering - block potential injection attempts
        suspicious_patterns = [
            r'<script',
            r'javascript:',
            r'onload=',
            r'onerror=',
            r'eval\(',
            r'exec\(',
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError("Query contains potentially harmful content")
        
        return v


class QueryResponse(BaseModel):
    """Response model for query endpoint."""
    
    response: str = Field(..., description="The LLM's response to the query")
    context: Optional[List[str]] = Field(
        default=None, 
        description="Source context used to generate the response"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional metadata about the response"
    )


class HealthCheckResponse(BaseModel):
    """Response model for health check endpoints."""
    
    status: str = Field(..., description="Health status: healthy, unhealthy, or degraded")
    version: str = Field(..., description="Application version")
    timestamp: str = Field(..., description="Timestamp of the health check")
    details: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional health check details"
    )


class ErrorResponse(BaseModel):
    """Standardized error response model."""
    
    error: str = Field(..., description="Error type or code")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional error details"
    )
    correlation_id: Optional[str] = Field(
        default=None,
        description="Request correlation ID for tracking"
    ) 