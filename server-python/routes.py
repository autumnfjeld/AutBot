from fastapi import APIRouter, HTTPException
from llm_engine import query_engine
from models import QueryRequest
from agent import AutBotAgent
from __version__ import __version__, CHANGELOG
import logging

logger = logging.getLogger(__name__)
agent = AutBotAgent(query_engine)

router = APIRouter()

@router.get("/api/version")
async def get_version():
    """Get server version information"""
    return {
        "version": __version__,
        "changelog": CHANGELOG
    }

@router.get("/api/test")
async def test():
    logger.info("Test endpoint hit")
    return {"message": "AutBot Python server is running!", "version": __version__}

@router.post("/api/query")
async def query_route(req: QueryRequest):
    logger.info(f"👍🏻 Received query: {req.query}")

    if not req.query or not isinstance(req.query, str):
        raise HTTPException(status_code=400, detail="Query must be a string")

    try:
        return await agent.get_response(req.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))