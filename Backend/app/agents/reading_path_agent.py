import json
import logging
from typing import List, Dict, Any
from app.utils.llm import call_llm
from app.prompts.reading_path import READING_PATH_PROMPT

logger = logging.getLogger(__name__)

class ReadingPathAgent:
    def __init__(self):
        pass

    async def generate_paths(
        self,
        papers: List[Dict[str, Any]],
        clusters: List[Dict[str, Any]],
        knowledge_graph: Dict[str, Any]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Generate reading paths for different levels: beginner, intermediate, researcher.
        Returns a dictionary with keys for each level containing a list of papers in order.
        """
        logger.info("Generating reading paths")

        if not papers:
            return {
                "beginner": [],
                "intermediate": [],
                "researcher": []
            }

        # Prepare paper information for the prompt
        paper_info = []
        for paper in papers[:15]:  # Limit to 15 papers for the prompt
            info = f"""
Title: {paper.get('title', 'N/A')}
Authors: {', '.join(paper.get('authors', [])) if isinstance(paper.get('authors'), list) else paper.get('authors', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')[:200]}...
Key Points:
- Problem: {paper.get('problem', 'N/A')[:100]}...
- Method: {paper.get('method', 'N/A')[:100]}...
"""
            paper_info.append(info)

        papers_text = "\n---\n".join(paper_info)

        # Prepare the prompt
        prompt = READING_PATH_PROMPT.format(papers=papers_text)

        # Call LLM
        try:
            response = await call_llm(prompt, temperature=0.3)
            paths = json.loads(response)
            # Validate and set defaults
            return self._validate_paths(paths)
        except Exception as e:
            logger.error(f"Error generating reading paths: {e}")
            return self._default_paths(papers)

    def _validate_paths(self, paths: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[Dict[str, Any]]]:
        """Ensure all expected keys are present and papers are valid."""
        expected_levels = ["beginner", "intermediate", "researcher"]
        for level in expected_levels:
            if level not in paths:
                paths[level] = []
            elif not isinstance(paths[level], list):
                paths[level] = []
            # Ensure each paper in the path has required fields
            valid_papers = []
            for paper in paths[level]:
                if isinstance(paper, dict) and paper.get('title'):
                    valid_papers.append(paper)
            paths[level] = valid_papers
        return paths

    def _default_paths(self, papers: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Return default paths based on paper order (simple fallback)."""
        # Sort by some metric (e.g., similarity score if available, or just order)
        sorted_papers = sorted(papers, key=lambda x: x.get('similarity_score', 0), reverse=True)
        # Split into thirds
        third = len(sorted_papers) // 3
        return {
            "beginner": sorted_papers[:third],
            "intermediate": sorted_papers[third:2*third],
            "researcher": sorted_papers[2*third:]
        }