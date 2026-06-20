import asyncio
import logging
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
import aiohttp
from app.utils.arxiv import fetch_papers_from_arxiv
from app.core.config import settings

logger = logging.getLogger(__name__)

class PaperRetrievalAgent:
    def __init__(self):
        self.base_url = settings.ARXIV_API_URL
        self.max_results = settings.ARXIV_MAX_RESULTS

    async def retrieve_papers(self, search_queries: List[str]) -> List[Dict[str, Any]]:
        """
        Retrieve papers from arXiv based on search queries.
        Returns a list of paper dictionaries.
        """
        logger.info(f"Retrieving papers for queries: {search_queries}")

        all_papers = []
        seen_ids = set()

        # For each search query, fetch papers
        for query in search_queries:
            try:
                papers = await fetch_papers_from_arxiv(query, self.max_results)
                for paper in papers:
                    # Avoid duplicates based on arxiv_id
                    if paper.get("arxiv_id") not in seen_ids:
                        seen_ids.add(paper.get("arxiv_id"))
                        all_papers.append(paper)
            except Exception as e:
                logger.error(f"Error retrieving papers for query '{query}': {e}")

        logger.info(f"Retrieved {len(all_papers)} unique papers")
        return all_papers