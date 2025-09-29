"""
Custom exceptions for the AutBot application.

This module defines specific exception types to improve error handling
and provide better debugging information.
"""

from typing import Optional, Dict, Any


class AutBotException(Exception):
    """Base exception for AutBot application."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class ConfigurationError(AutBotException):
    """Raised when configuration is invalid or missing."""
    pass


class InvalidQueryException(AutBotException):
    """Raised when query is invalid or malformed."""
    pass


class RateLimitExceeded(AutBotException):
    """Raised when rate limit is exceeded."""
    pass


class LLMServiceException(AutBotException):
    """Raised when LLM service is unavailable or returns an error."""
    pass


class DocumentLoadingException(AutBotException):
    """Raised when document loading fails."""
    pass


class VectorStoreException(AutBotException):
    """Raised when vector store operations fail."""
    pass