from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Document
from llama_index.core.prompts import RichPromptTemplate
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.response_synthesizers import get_response_synthesizer
from config import logger
import inspect
import os

# Set up custom prompt
def get_prompt():
    return RichPromptTemplate(
        """
        You are AutBot, a helpful assistant that shares interesting facts about Autumn Fjeld's work experience and skills. Autumn Fjeld is a human, a smart lady, use she/her pronouns.  The intended audience for AutBot is potential employers or recruiters.  Your answers should be witty and friendly, but not sappy or flowery.  Do not exaggerate the facts. Always include a statement about Autumn's work experience or skills from the resume context. 

        Add paragraph breaks to the response to make it more readable.

        You have access to multiple sources of information:
        * The **resume** context, which contains information about Autumn's work experience, education, and skills. This is the most important source of information. 
        * The **fun facts** context, which contains information about Autumn's hobbies and interests.
        * The **kudos** context, which contains kudos from Autumn's coworkers at Automattic.

      
        If the query question is specific and simple, for example "Where is autumn from?" or "What books has Autumn read?", then answer that directly.

        If the query is open ended and not specific, then answer with information about Autumn's work experience or skills. Mention a specific achievement in addition to making general summaries. The response can also include a fun fact or kudo, but do not overuse the fun facts or kudos. 

        The fun facts are the least important source of information, but can be used to answer questions that are not specific to Autumn's work experience or skills.

        ---------------------
        {{ context_str }}
        ---------------------

        Question: {{ query_str }}
        Answer:
        """
    )

def load_weighted_documents():
    """Load documents and assign weights based on file type"""
    logger.info("🔍 Loading documents with weights...")
    
    # Load all documents from data directory
    documents = SimpleDirectoryReader("./data").load_data()
    
    # Deduplicate documents based on file_name
    seen_files = set()
    unique_documents = []
    
    for doc in documents:
        filename = doc.metadata.get('file_name', '')
        if filename not in seen_files:
            seen_files.add(filename)
            unique_documents.append(doc)
        else:
            logger.info(f"Skipping duplicate: {filename}")
    
    # Assign weights based on file names/types
    for doc in unique_documents:
        filename = doc.metadata.get('file_name', '').lower()
        
        if 'resume' in filename or filename.endswith('.pdf'):
            doc.metadata["weight"] = 2.0  # Higher weight for resume
            doc.metadata["doc_type"] = "resume"
            logger.info(f" • {filename} (resume, weight: 2.0)")
        elif 'kudos' in filename:
            doc.metadata["weight"] = 0.5  # Lower weight for kudos
            doc.metadata["doc_type"] = "kudos"
            logger.info(f" • {filename} (kudos, weight: 0.5)")
        else:
            doc.metadata["weight"] = 0.5  # Lower weight for other files (funfacts)
            doc.metadata["doc_type"] = "funfacts"
            logger.info(f" • {filename} (funfacts, weight: 0.5)")
    
    logger.info(f"✅ Loaded {len(unique_documents)} unique documents with weights")
    return unique_documents

class WeightedRetriever(VectorIndexRetriever):
    """Custom retriever that considers document weights during retrieval"""
    
    def retrieve(self, query_bundle):
        # Get base retrieval results
        base_results = super().retrieve(query_bundle)
        
        # Apply weights to scores
        for result in base_results:
            weight = result.node.metadata.get('weight', 1.0)
            # Boost score based on document weight
            result.score = result.score * weight
            logger.debug(f"Retrieved: {result.node.metadata.get('file_name', 'unknown')} "
                        f"(weight: {weight}, score: {result.score})")
        
        # Re-sort by weighted scores
        base_results.sort(key=lambda x: x.score, reverse=True)
        
        return base_results

# Load and index documents with weights
documents = load_weighted_documents()
index = VectorStoreIndex.from_documents(documents)
custom_prompt_template = get_prompt()

# Create weighted retriever
weighted_retriever = WeightedRetriever(index)

# Create response synthesizer with custom prompt
response_synthesizer = get_response_synthesizer(
    text_qa_template=custom_prompt_template
)

# Create query engine with weighted retriever
query_engine = RetrieverQueryEngine(
    retriever=weighted_retriever,
    response_synthesizer=response_synthesizer
)

logger.info("✅ LlamaIndex query engine ready with weighted retrieval")
logger.info(inspect.signature(query_engine.query)) 