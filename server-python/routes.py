from fastapi import APIRouter, HTTPException
from llm_engine import query_engine
from models import QueryRequest
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/api/test")
async def test():
    logger.info("Test endpoint hit")
    return {"message": "AutBot Python server is running!"}

@router.post("/api/query")
async def query_route(req: QueryRequest):
    logger.info(f"👍🏻 Received query: {req.query}")

    if not req.query or not isinstance(req.query, str):
        raise HTTPException(status_code=400, detail="Query must be a string")

    try:
        result = query_engine.query(req.query)
        return {"response": str(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 