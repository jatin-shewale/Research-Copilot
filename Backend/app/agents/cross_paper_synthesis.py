import json
import logging
from typing import List, Dict, Any
from app.utils.llm import call_llm
from app.prompts.cross_paper_synthesis import CROSS_PAPER_SYNTHESIS_PROMPT

logger = logging.getLogger(__name__)

class CrossPaperSynthesisAgent:
    def __init__(self):
        pass

    async def synthesize(self, papers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Synthesize information across papers to generate a research landscape.
        Returns a dictionary with keys:
        - major_clusters: List of major research clusters/themes
        - key_methods: List of key methodologies
        - research_directions: Current research directions
        - emerging_trends: Emerging trends in the field
        - important_authors: List of important/authorship metrics
        - important_papers: List of important/popular papers
        - controversies: Known controversies or debates
        - limitations: Common limitations across papers
        - open_problems: Open problems and research gaps
        """
        logger.info(f"Synthesizing research landscape from {len(papers)} papers")

        if not papers:
            return self._empty_synthesis()

        # Prepare paper summaries for the prompt
        paper_summaries = []
        for paper in papers:
            summary = f"""
Title: {paper.get('title', 'N/A')}
Authors: {', '.join(paper.get('authors', [])) if isinstance(paper.get('authors'), list) else paper.get('authors', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')[:500]}...
Extracted Info:
- Problem: {paper.get('problem', 'N/A')}
- Method: {paper.get('method', 'N/A')}
- Results: {paper.get('results', 'N/A')}
- Limitations: {paper.get('limitations', 'N/A')}
"""
            paper_summaries.append(summary)

        # Combine summaries (limit to avoid too long prompt)
        combined_summaries = "\n---\n".join(paper_summaries[:20])  # Limit to 20 papers

        # Prepare the prompt
        prompt = CROSS_PAPER_SYNTHESIS_PROMPT.format(papers=combined_summaries)

        # Call LLM
        try:
            response = await call_llm(prompt, temperature=0.3)
            synthesis = json.loads(response)
            # Validate and set defaults
            return self._validate_synthesis(synthesis)
        except Exception as e:
            logger.error(f"Error in cross paper synthesis: {e}")
            return self._empty_synthesis()

    def _validate_synthesis(self, synthesis: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure all expected keys are present with appropriate types."""
        expected_keys = [
            'major_clusters', 'key_methods', 'research_directions',
            'emerging_trends', 'important_authors', 'important_papers',
            'controversies', 'limitations', 'open_problems'
        ]
        for key in expected_keys:
            if key not in synthesis:
                synthesis[key] = [] if key not in ['important_authors', 'important_papers'] else []
            elif not isinstance(synthesis[key], list):
                synthesis[key] = [str(synthesis[key])] if synthesis[key] else []
        return synthesis

    def _empty_synthesis(self) -> Dict[str, Any]:
        """Return an empty synthesis structure."""
        return {
            'major_clusters': [],
            'key_methods': [],
            'research_directions': [],
            'emerging_trends': [],
            'important_authors': [],
            'important_papers': [],
            'controversies': [],
            'limitations': [],
            'open_problems': []
        }