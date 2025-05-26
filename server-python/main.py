# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import logger, OPENAI_API_KEY
from routes import router
from __version__ import __version__
import openai

# Load OpenAI key
openai.api_key = OPENAI_API_KEY

# Create FastAPI app with version info
app = FastAPI(
    title="AutBot Server",
    description="Interactive resume chatbot for Autumn Fjeld",
    version=__version__
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

## Routes

app.include_router(router)

logger.info(f"🚀 AutBot Server v{__version__} starting up")