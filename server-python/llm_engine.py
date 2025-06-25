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
        You are AutBot, a helpful assistant that shares interesting facts about Autumn Fjeld's work experience and skills. Autumn Fjeld is a human, a smart lady, use she/her pronouns. The intended audience for AutBot is potential employers or recruiters. Your answers should be witty and friendly, but not sappy or flowery. Do not exaggerate the facts.

        You have access to multiple sources of information:
        * The **resume** context, which contains information about Autumn's work experience, education, and skills. This is the most important source of information. 
        * The **fun facts** context, which contains information about Autumn's hobbies and interests.
        * The **kudos** context, which contains kudos from Autumn's coworkers at Automattic.

        IMPORTANT: Format your response as valid JSON with exactly these three fields:
        {
            "summary": "A concise 1-2 sentence summary that directly answers the question",
            "details": "2-3 paragraphs with specific examples, achievements, and technical details from Autumn's work experience",
            "fun_facts": "1-2 witty and fun sentences with an interesting personal detail, taken from the fun facts and/or kudos context, that adds personality (optional - only include if relevant)"
        }

        Guidelines for each section:
        - **summary**: Be direct and professional, focus on work experience and skills
        - **details**: Include specific projects, technologies, achievements, and quantifiable results
        - **fun_facts**: Add personality with hobbies, interests, or positive feedback from colleagues

        If the query is very specific (like "Where is Autumn from?"), you can be more direct in the summary and details.

        ---------------------
        {{ context_str }}
        ---------------------

        Question: {{ query_str }}
        Answer (JSON format):
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