import logging
from typing import List, Dict, Any, Optional
from app.utils.embedding import get_embeddings
from app.utils.llm import call_llm
from app.prompts.research_chat import RESEARCH_CHAT_PROMPT
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

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

        # Retrieve relevant papers based on question similarity
        try:
            relevant_papers = await self._retrieve_relevant_papers(question, papers, top_k=5)
        except Exception as e:
            logger.error(f"Error retrieving relevant papers: {e}")
            relevant_papers = papers[:5]  # Fallback to first 5 papers

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
        Retrieve the most relevant papers for a given question using embedding similarity.
        """
        # Get embedding for the question
        question_embedding = await get_embeddings([question])
        question_vector = np.array(question_embedding)

        # Get embeddings for paper abstracts
        abstracts = [paper.get('abstract', '') for paper in papers]
        if not abstracts:
            return papers[:top_k]

        abstract_embeddings = await get_embeddings(abstracts)
        abstract_vectors = np.array(abstract_embeddings)

        # Compute cosine similarity
        similarities = cosine_similarity(question_vector, abstract_vectors)[0]

        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]

        # Return the top papers with their similarity scores
        relevant_papers = []
        for idx in top_indices:
            paper = papers[idx].copy()
            paper['similarity_score'] = float(similarities[idx])
            relevant_papers.append(paper)

        return relevant_papers

    def _prepare_context(self, papers: List[Dict[str, Any]]) -> str:
        """
        Prepare a context string from the relevant papers for the LLM.
        """
        context_parts = []
        for i, paper in enumerate(papers, 1):
            context_part = f"""
[Paper {i}]
Title: {paper.get('title', 'N/A')}
Authors: {', '.join(paper.get('authors', [])) if isinstance(paper.get('authors'), list) else paper.get('authors', 'N/A')}
Abstract: {paper.get('abstract', 'N/A')}
Key Points:
- Problem: {paper.get('problem', 'N/A')}
- Method: {paper.get('method', 'N/A')}
- Results: {paper.get('results', 'N/A')}
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
            for turn in chat_history[-3:]:  # Last 3 turns
                history_text += f"Human: {turn.get('human', '')}\nAssistant: {turn.get('assistant', '')}\n"

        # Prepare the prompt
        prompt = RESEARCH_CHAT_PROMPT.format(
            question=question,
            context=context,
            history=history_text
        )

        # Call LLM
        response = await call_llm(prompt, temperature=0.5)

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