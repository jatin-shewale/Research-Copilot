import logging
from typing import List, Dict, Any
import numpy as np
from app.utils.embedding import get_embeddings
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

class SemanticRerankingAgent:
    def __init__(self):
        pass

    async def rerank(self, papers: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """
        Rerank papers based on semantic similarity to the query.
        Returns the top papers after reranking.
        """
        logger.info(f"Reranking {len(papers)} papers for query: {query}")

        if not papers:
            return []

        # Extract abstracts for embedding
        abstracts = [paper.get('abstract', '') for paper in papers]

        # Get embeddings for abstracts and query
        try:
            abstract_embeddings = await get_embeddings(abstracts)
            query_embedding = await get_embeddings([query])
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            # Fallback to original order
            return papers

        # Compute cosine similarity
        similarities = cosine_similarity(query_embedding, abstract_embeddings)[0]

        # Add similarity scores to papers
        for i, paper in enumerate(papers):
            paper['similarity_score'] = float(similarities[i])

        # Sort by similarity score (descending)
        reranked_papers = sorted(papers, key=lambda x: x['similarity_score'], reverse=True)

        # Return top papers (we'll keep all for now, but in practice we might limit)
        logger.info(f"Reranking completed. Top score: {reranked_papers[0]['similarity_score'] if reranked_papers else 0}")
        return reranked_papers