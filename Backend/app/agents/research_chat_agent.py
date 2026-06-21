import logging
import re
from collections import Counter
from typing import List, Dict, Any, Optional
from app.utils.llm import call_llm
from app.prompts.research_chat import RESEARCH_CHAT_PROMPT

logger = logging.getLogger(__name__)

class ResearchChatAgent:
    def __init__(self):
        pass

    async def chat(
        self,
        question: str,
        papers: List[Dict[str, Any]],
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Answer a question based on the research papers using RAG.
        Returns a dictionary with:
        - answer: The generated answer
        - citations: List of papers cited in the answer
        - confidence: Confidence score (0-1)
        """
        logger.info(f"Processing chat question: {question}")

        if not papers:
            return {
                "answer": "I don't have any papers to answer your question. Please start a research session first.",
                "citations": [],
                "confidence": 0.0
            }

        # Keep the chat path fast: use lightweight scoring instead of embeddings.
        try:
            relevant_papers = self._retrieve_relevant_papers(question, papers, top_k=3)
        except Exception as e:
            logger.error(f"Error retrieving relevant papers: {e}")
            relevant_papers = papers[:3]  # Fallback to first 3 papers

        # Prepare context from relevant papers
        context = self._prepare_context(relevant_papers)

        # Generate answer using LLM
        try:
            answer_result = await self._generate_answer(question, context, chat_history)
            return answer_result
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return {
                "answer": "I encountered an error while trying to answer your question. Please try again.",
                "citations": [],
                "confidence": 0.0
            }

    async def _retrieve_relevant_papers(
        self,
        question: str,
        papers: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the most relevant papers for a given question using lightweight token overlap.
        """
        if not papers:
            return papers[:top_k]

        question_tokens = self._tokenize(question)
        if not question_tokens:
            return papers[:top_k]

        scored = []
        for paper in papers:
            paper_copy = paper.copy()
            paper_copy['similarity_score'] = self._score_paper(paper_copy, question_tokens)
            scored.append(paper_copy)

        scored.sort(key=lambda item: item.get('similarity_score', 0), reverse=True)
        return scored[:top_k]

    def _prepare_context(self, papers: List[Dict[str, Any]]) -> str:
        """
        Prepare a context string from the relevant papers for the LLM.
        """
        context_parts = []
        for i, paper in enumerate(papers, 1):
            title = str(paper.get('title', 'N/A'))[:140]
            abstract = str(paper.get('abstract', 'N/A'))[:700]
            problem = str(paper.get('problem', 'N/A'))[:180]
            method = str(paper.get('method', 'N/A'))[:180]
            results = str(paper.get('results', 'N/A'))[:180]
            context_part = f"""
[Paper {i}]
Title: {title}
Authors: {', '.join(paper.get('authors', [])) if isinstance(paper.get('authors'), list) else paper.get('authors', 'N/A')}
Abstract: {abstract}
Key Points:
- Problem: {problem}
- Method: {method}
- Results: {results}
"""
            context_parts.append(context_part)
        return "\n---\n".join(context_parts)

    async def _generate_answer(
        self,
        question: str,
        context: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generate an answer based on the context using LLM.
        """
        # Prepare chat history if available
        history_text = ""
        if chat_history:
            for turn in chat_history[-2:]:  # Last 2 turns to keep the prompt lean
                human = turn.get('human', turn.get('content', ''))
                assistant = turn.get('assistant', '')
                history_text += f"Human: {str(human)[:300]}\nAssistant: {str(assistant)[:300]}\n"

        # Prepare the prompt
        prompt = RESEARCH_CHAT_PROMPT.format(
            question=question,
            context=context,
            history=history_text
        )

        # Call LLM
        response = await call_llm(prompt, temperature=0.3, max_tokens=700)

        # Extract answer and citations (simplified)
        # In a more advanced version, we would parse citations from the response
        answer = response.strip()

        # For now, we'll return all context papers as citations
        # A better approach would be to extract cited papers from the answer
        citations = []  # We'll implement citation extraction later

        return {
            "answer": answer,
            "citations": citations,
            "confidence": 0.8  # Placeholder confidence
        }

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        return [token for token in re.findall(r"[a-z0-9]+", (text or "").lower()) if len(token) > 2]

    def _score_paper(self, paper: Dict[str, Any], question_tokens: List[str]) -> float:
        text = " ".join(
            str(paper.get(field, "") or "")
            for field in ("title", "abstract", "problem", "method", "results", "categories")
        ).lower()
        paper_tokens = Counter(self._tokenize(text))
        if not paper_tokens:
            return 0.0

        overlap = sum(1 for token in question_tokens if token in paper_tokens)
        title_bonus = sum(1 for token in question_tokens if token in self._tokenize(str(paper.get("title", ""))))
        return overlap + (title_bonus * 0.75)
