import json
import logging
from typing import List, Dict, Any
from app.utils.llm import call_llm
from app.prompts.paper_extraction import PAPER_EXTRACTION_PROMPT

logger = logging.getLogger(__name__)

class PaperExtractionAgent:
    def __init__(self):
        pass

    async def extract_papers(self, papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract structured information from each paper.
        Returns papers with added extracted fields.
        """
        logger.info(f"Extracting information from {len(papers)} papers")

        extracted_papers = []
        for paper in papers:
            try:
                extracted = await self._extract_paper_info(paper)
                # Merge extracted info with original paper data
                paper.update(extracted)
                extracted_papers.append(paper)
            except Exception as e:
                logger.error(f"Error extracting paper {paper.get('arxiv_id', 'unknown')}: {e}")
                # If extraction fails, keep the paper with empty extracted fields
                extracted_papers.append(paper)

        logger.info("Paper extraction completed")
        return extracted_papers

    async def _extract_paper_info(self, paper: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract structured information from a single paper.
        """
        # Prepare the prompt
        prompt = PAPER_EXTRACTION_PROMPT.format(
            title=paper.get('title', ''),
            abstract=paper.get('abstract', '')
        )

        # Call LLM
        response = await call_llm(prompt, temperature=0.2)

        # Parse JSON response
        try:
            extracted = json.loads(response)
            # Ensure all expected fields are present
            expected_fields = [
                'problem', 'motivation', 'method', 'datasets', 'architecture',
                'training_strategy', 'evaluation', 'results', 'limitations',
                'future_work', 'contribution'
            ]
            for field in expected_fields:
                extracted.setdefault(field, None)
            return extracted
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse extraction response: {e}")
            # Return empty fields
            return {
                'problem': None, 'motivation': None, 'method': None, 'datasets': None,
                'architecture': None, 'training_strategy': None, 'evaluation': None,
                'results': None, 'limitations': None, 'future_work': None, 'contribution': None
            }