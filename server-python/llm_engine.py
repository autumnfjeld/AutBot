from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.core.prompts import RichPromptTemplate
from config import logger
import inspect

# Set up custom prompt
def get_prompt():
    return RichPromptTemplate(
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

logger.info("🔍 Loading documents...")
documents = SimpleDirectoryReader("./data").load_data()
logger.info(f"✅ Loaded {len(documents)} documents:")
for d in documents:
    logger.info(f" • {d.doc_id}")
index = VectorStoreIndex.from_documents(documents)
custom_prompt_template = get_prompt()
query_engine = index.as_query_engine(
    text_qa_template=custom_prompt_template
)
logger.info("✅ LlamaIndex query engine ready")
logger.info(inspect.signature(query_engine.query)) 