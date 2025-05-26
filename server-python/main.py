# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import logger, OPENAI_API_KEY
from routes import router
import openai

# Load OpenAI key
openai.api_key = OPENAI_API_KEY

# Create FastAPI app
app = FastAPI()

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