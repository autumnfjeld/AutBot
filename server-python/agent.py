"""
AutBot Agent - Handles interactions with the LLM
"""
from typing import List, Dict, Any
from llama_index.core import Document
from llama_index.core.base.response.schema import Response
from config import logger

class AutBotAgent:
    def __init__(self, query_engine):
        """Initialize the AutBot agent with a query engine"""
        self.query_engine = query_engine
        logger.info("🤖 AutBot Agent initialized")

    async def get_response(self, query: str) -> Dict[str, Any]:
        """
        Get a response from the LLM for the given query
        
        Args:
            query (str): The user's query
            
        Returns:
            Dict containing response text and context
        """
        try:
            # Get response from query engine
            result: Response = self.query_engine.query(query)
            response_text = str(result)
            
            # Extract source context
            context: List[str] = []
            if hasattr(result, 'source_nodes'):
                context = [node.text for node in result.source_nodes]
            
            # Log the interaction
            logger.info(f"AUTBOT_QUERY: {query}")
            logger.info(f"AUTBOT_RESPONSE: {response_text}")
            logger.info(f"AUTBOT_CONTEXT: {len(context)} chunks")
            for i, chunk in enumerate(context):
                logger.info(f"AUTBOT_CONTEXT_{i}: {chunk}")
            
            return {
                "response": response_text,
                "context": context
            }
            
        except Exception as e:
            logger.error(f"Error in AutBot agent: {str(e)}")
            raise