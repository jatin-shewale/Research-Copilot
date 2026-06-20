import json
import logging
from typing import Any, Dict, List
from app.utils.llm import call_llm
from app.prompts.query_understanding import QUERY_UNDERSTANDING_PROMPT

logger = logging.getLogger(__name__)

class QueryUnderstandingAgent:
    def __init__(self):
        pass

    async def process(self, query: str) -> Dict[str, Any]:
        """
        Process the user query to understand the research topic.
        Returns a dictionary with:
        - topic: str
        - subtopics: List[str]
        - related_topics: List[str]
        - search_queries: List[str]
        """
        logger.info(f"Processing query understanding for: {query}")

        # Prepare the prompt
        prompt = QUERY_UNDERSTANDING_PROMPT.format(query=query)

        # Call LLM
        try:
            response = await call_llm(prompt, temperature=0.3)
            # Parse the JSON response
            result = json.loads(response)
            # Validate and set defaults
            result.setdefault("topic", query)
            result.setdefault("subtopics", [])
            result.setdefault("related_topics", [])
            result.setdefault("search_queries", [query])
            return result
        except Exception as e:
            logger.error(f"Error in query understanding: {e}")
            # Fallback to basic result
            return {
                "topic": query,
                "subtopics": [],
                "related_topics": [],
                "search_queries": [query]
            }
