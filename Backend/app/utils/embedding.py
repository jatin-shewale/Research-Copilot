import logging
from typing import List, Union
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.config import settings

logger = logging.getLogger(__name__)

# Load the embedding model (singleton)
_model = None

def get_model():
    global _model
    if _model is None:
        logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}")
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
    return _model

async def get_embeddings(texts: Union[str, List[str]]) -> List[List[float]]:
    """
    Generate embeddings for a list of texts.
    Returns a list of embeddings (each embedding is a list of floats).
    """
    if isinstance(texts, str):
        texts = [texts]

    try:
        model = get_model()
        # Generate embeddings
        embeddings = model.encode(texts, convert_to_tensor=False)
        # Convert to list of lists
        return embeddings.tolist()
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        # Return zero vectors as fallback
        dim = 384  # Default dimension for BGE model
        return [[0.0] * dim for _ in texts]