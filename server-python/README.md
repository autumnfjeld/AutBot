# AutBot Python Server

Production-ready FastAPI server for the AutBot interactive resume chatbot.

## Features

### 🔒 Security
- Environment-based configuration management
- CORS policy based on environment
- Input validation and sanitization
- Rate limiting with configurable limits

### ⚡ Performance & Reliability
- Request correlation IDs for tracking
- Structured error handling with proper HTTP status codes
- Health check endpoints for load balancers
- Graceful startup and shutdown handling

### 📊 Observability
- Structured logging with correlation IDs
- Request timing and metrics
- Health and readiness endpoints
- Version information endpoint

### 🛠️ Code Quality
- Type hints and validation with Pydantic
- Custom exception classes
- Modular architecture
- Comprehensive error handling

## API Endpoints

### Health & Status
- `GET /health` - Basic health check
- `GET /ready` - Readiness check with dependency validation
- `GET /api/version` - Version and changelog information

### Core Functionality
- `GET /api/test` - Test endpoint with rate limiting
- `POST /api/query` - Process queries through LLM (requires OpenAI API key)

## Configuration

The server uses environment variables for configuration:

```bash
# Environment
ENVIRONMENT=development|production
DEBUG=true|false

# Security
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Logging
LOG_LEVEL=INFO|DEBUG|WARNING|ERROR
```

## Development

### Local Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 3001
```

### Testing
```bash
# Run tests
python -m pytest tests/ -v

# Health check
curl http://localhost:3001/health

# Test endpoint
curl http://localhost:3001/api/test

# Query endpoint (requires OpenAI API key)
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did Autumn do well?"}'
```

## Production Deployment

### Environment Variables
Set the following in production:
- `ENVIRONMENT=production`
- `DEBUG=false`
- `OPENAI_API_KEY=your_production_key`
- `ALLOWED_ORIGINS=https://your-frontend-domain.com`

### Health Checks
Configure your load balancer to use:
- Health check: `/health`
- Readiness check: `/ready`

### Monitoring
- Check logs for correlation IDs to track requests
- Monitor `/health` and `/ready` endpoints
- Set up alerting for 5xx errors

## Error Handling

The server returns structured error responses:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": {
    "additional": "context"
  },
  "correlation_id": "request-tracking-id"
}
```

## Rate Limiting

Rate limiting is applied per IP address:
- Test endpoint: Configurable limit (default: 100 requests/hour)
- Query endpoint: Same configurable limit
- Returns 429 status with retry information when exceeded

## Architecture

```
main.py          # FastAPI app setup, middleware, exception handling
routes.py        # API endpoints and request handling
config.py        # Configuration management
models.py        # Pydantic models for requests/responses
exceptions.py    # Custom exception classes
rate_limiter.py  # In-memory rate limiting
agent.py         # LLM interaction logic
llm_engine.py    # LlamaIndex setup and configuration
```

## Future Improvements

See `PRODUCTION_IMPROVEMENTS.md` for detailed roadmap including:
- Redis-based rate limiting for multi-instance deployments
- Prometheus metrics integration
- Advanced logging with structured JSON
- Container security hardening
- Performance optimization