import json
import logging
from typing import List, Dict, Any
from app.utils.llm import call_llm
from app.prompts.research_gap import RESEARCH_GAP_PROMPT

logger = logging.getLogger(__name__)

class ResearchGapDetector:
    def __init__(self):
        pass

    async def detect_gaps(
        self,
        papers: List[Dict[str, Any]],
        clusters: List[Dict[str, Any]],
        synthesis: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Detect research gaps and opportunities.
        Returns a list of gap objects, each with:
        - description: Description of the gap
        - type: Type of gap (e.g., "underexplored_combination", "unresolved_problem")
        - confidence: Confidence score (0-1)
        - supporting_papers: List of papers that relate to this gap
        """
        logger.info("Detecting research gaps")

        if not papers:
            return []

        # Prepare context for the prompt
        # We'll use the synthesis and cluster information
        synthesis_text = json.dumps(synthesis, indent=2)
        clusters_text = json.dumps(clusters, indent=2)

        # Prepare paper summaries (limit to avoid too long prompt)
        paper_summaries = []
        for paper in papers[:10]:
            summary = f"""
Title: {paper.get('title', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')[:300]}...
"""
            paper_summaries.append(summary)
        papers_text = "\n---\n".join(paper_summaries)

        # Prepare the prompt
        prompt = RESEARCH_GAP_PROMPT.format(
            papers=papers_text,
            synthesis=synthesis_text,
            clusters=clusters_text
        )

        # Call LLM
        try:
            response = await call_llm(prompt, temperature=0.4)
            gaps = json.loads(response)
            # Validate and enrich gaps
            validated_gaps = self._validate_gaps(gaps, papers)
            return validated_gaps
        except Exception as e:
            logger.error(f"Error detecting research gaps: {e}")
            return self._default_gaps()

    def _validate_gaps(self, gaps: List[Dict[str, Any]], papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Ensure each gap has the required fields and valid values."""
        validated = []
        for gap in gaps:
            if not isinstance(gap, dict):
                continue
            # Ensure required fields
            gap.setdefault("description", "")
            gap.setdefault("type", "unspecified")
            gap.setdefault("confidence", 0.5)
            gap.setdefault("supporting_papers", [])

            # Validate confidence
            try:
                confidence = float(gap["confidence"])
                if confidence < 0 or confidence > 1:
                    confidence = 0.5
                gap["confidence"] = confidence
            except ValueError:
                gap["confidence"] = 0.5

            # Ensure supporting_papers is a list of paper identifiers
            valid_supporting = []
            for paper_ref in gap["supporting_papers"]:
                if isinstance(paper_ref, str):
                    valid_supporting.append(paper_ref)
                elif isinstance(paper_ref, dict) and paper_ref.get("title"):
                    valid_supporting.append(paper_ref.get("title"))
            gap["supporting_papers"] = valid_supporting

            if gap["description"]:  # Only add gaps with a description
                validated.append(gap)

        return validated

    def _default_gaps(self) -> List[Dict[str, Any]]:
        """Return a default gap structure."""
        return [{
            "description": "Insufficient data to detect specific research gaps",
            "type": "data_insufficient",
            "confidence": 0.3,
            "supporting_papers": []
        }]