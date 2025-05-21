# main.py
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.prompts import RichPromptTemplate
import inspect
import logging
import os
import openai
from pydantic import BaseModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load OpenAI key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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

# Model for request body
class QueryRequest(BaseModel):
    query: str

# Set up custom prompt
custom_prompt_template = RichPromptTemplate(
    """
    You are AutBot, a helpful assistant that shares interesting facts about Autumn Fjeld's work experience and skills. Autumn Fjeld is a human, a smart lady, use she/her pronouns.  The intended audience for AutBot is potential employers or recruiters.  Your answers should be witty and friendly, but not sappy or flowery. Use literary references if the context and query makes sense. Do not exaggerate the facts and always include comments about Autumn' work experience or skills. 

    You have access to multiple sources of information:
    * The **resume** context, which contains information about Autumn's work experience, education, and skills. This is the most important source of information.
    * The **fun facts** context, which contains information about Autumn's hobbies and interests.
    * The **kudos** context, which contains kudos from Autumn's coworkers at Automattic.

  
    If the query question is specific and simple, for example "Where is autumn from?" or "What books has Autumn read?", then answer that directly.

    If the query is open ended and not specific, then answer with information about my work experience or skills.  The response can also include a fun fact or kudo, but do not overuse the fun facts or kudos.

      The fun facts are the least important source of information, but can be used to answer questions that are not specific to Autumn's work experience or skills.




    ---------------------
    {{ context_str }}
    ---------------------

    Question: {{ query_str }}
    Answer:
    """
)

# Load and index documents on startup
print("🔍 Loading documents...")
documents = SimpleDirectoryReader("./data").load_data()
logger.info(f"✅ Loaded {len(documents)} documents:")
for d in documents:
    logger.info(f" • {d.doc_id}")
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine(
    text_qa_template=custom_prompt_template
)
print("✅ LlamaIndex query engine ready")

# AutDev 
print(inspect.signature(query_engine.query))

## Routes

@app.get("/api/test")
async def test():
    logger.info("Test endpoint hit")
    return {"message": "AutBot Python server is running!"}

@app.post("/api/query")
async def query_route(req: QueryRequest):
    logger.info(f"👍🏻 Received query: {req.query}")

    if not req.query or not isinstance(req.query, str):
        raise HTTPException(status_code=400, detail="Query must be a string")

    try:
        result = query_engine.query(req.query)
        return {"response": str(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))