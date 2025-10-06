import os
import logging
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    """Application settings with environment-based configuration."""
    
    def __init__(self):
        # Environment
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        
        # Security
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        
        # Parse allowed origins from environment or use defaults
        origins_env = os.getenv("ALLOWED_ORIGINS", "")
        if origins_env:
            self.allowed_origins = [origin.strip() for origin in origins_env.split(",")]
        else:
            # Default origins based on environment
            if self.environment == "production":
                self.allowed_origins = ["https://autbot.vercel.app"]
            else:
                self.allowed_origins = ["http://localhost:3000", "http://localhost:5173"]
        
        # Rate Limiting
        self.rate_limit_requests = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
        self.rate_limit_window = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))  # 1 hour
        
        # Logging
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        
        # Validate configuration
        self._validate()
    
    def _validate(self):
        """Validate configuration settings."""
        if not self.openai_api_key:
            logging.warning("OpenAI API key not found. Some features may not work.")
        
        # Ensure CORS origins are properly configured for production
        if self.environment == "production" and "*" in self.allowed_origins:
            raise ValueError("Wildcard origins not allowed in production")

# Global settings instance
settings = Settings()

# Setup structured logging
def setup_logging():
    """Configure structured logging based on environment."""
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    if settings.environment == "production":
        # In production, use JSON structured logging
        import json
        import datetime
        
        class JSONFormatter(logging.Formatter):
            def format(self, record):
                log_entry = {
                    "timestamp": datetime.datetime.utcnow().isoformat(),
                    "level": record.levelname,
                    "logger": record.name,
                    "message": record.getMessage(),
                    "module": record.module,
                    "line": record.lineno,
                }
                if hasattr(record, 'correlation_id'):
                    log_entry["correlation_id"] = record.correlation_id
                return json.dumps(log_entry)
        
        formatter = JSONFormatter()
    else:
        formatter = logging.Formatter(log_format)
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper()),
        format=log_format if settings.environment != "production" else None,
        handlers=[logging.StreamHandler()]
    )
    
    # Apply JSON formatter to all handlers in production
    if settings.environment == "production":
        for handler in logging.root.handlers:
            handler.setFormatter(formatter)

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

# Legacy compatibility - can be removed after refactoring
OPENAI_API_KEY = settings.openai_api_key

logger.info(f"🔧 Configuration loaded for environment: {settings.environment}")
if not OPENAI_API_KEY:
    logger.warning("⚠️  OpenAI API key not configured - some features will be disabled") 