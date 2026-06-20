from typing import Dict, List, Any
import asyncio
import logging
from app.agents.query_understanding import QueryUnderstandingAgent
from app.agents.paper_retrieval import PaperRetrievalAgent
from app.agents.semantic_reranking import SemanticRerankingAgent
from app.agents.paper_extraction import PaperExtractionAgent
from app.agents.cross_paper_synthesis import CrossPaperSynthesisAgent
from app.agents.clustering_engine import ClusteringEngine
from app.agents.knowledge_graph_generator import KnowledgeGraphGenerator
from app.agents.reading_path_agent import ReadingPathAgent
from app.agents.research_gap_detector import ResearchGapDetector
from app.agents.research_chat_agent import ResearchChatAgent

logger = logging.getLogger(__name__)

class ResearchPipeline:
    def __init__(self):
        self.query_understanding = QueryUnderstandingAgent()
        self.paper_retrieval = PaperRetrievalAgent()
        self.semantic_reranking = SemanticRerankingAgent()
        self.paper_extraction = PaperExtractionAgent()
        self.cross_paper_synthesis = CrossPaperSynthesisAgent()
        self.clustering_engine = ClusteringEngine()
        self.knowledge_graph_generator = KnowledgeGraphGenerator()
        self.reading_path_agent = ReadingPathAgent()
        self.research_gap_detector = ResearchGapDetector()
        self.research_chat_agent = ResearchChatAgent()

    async def run(self, query: str) -> Dict[str, Any]:
        """
        Run the full research pipeline.
        Returns a dictionary containing all results.
        """
        logger.info(f"Starting research pipeline for query: {query}")

        # Step 1: Query Understanding
        logger.info("Step 1: Query Understanding")
        query_understanding_result = await self.query_understanding.process(query)

        # Step 2: Paper Retrieval
        logger.info("Step 2: Paper Retrieval")
        search_queries = query_understanding_result.get("search_queries", [query])
        papers = await self.paper_retrieval.retrieve_papers(search_queries)

        # Step 3: Semantic Reranking
        logger.info("Step 3: Semantic Reranking")
        reranked_papers = await self.semantic_reranking.rerank(papers, query)

        # Step 4: Paper Extraction
        logger.info("Step 4: Paper Extraction")
        extracted_papers = await self.paper_extraction.extract_papers(reranked_papers)

        # Step 5: Cross Paper Synthesis
        logger.info("Step 5: Cross Paper Synthesis")
        synthesis_result = await self.cross_paper_synthesis.synthesize(extracted_papers)

        # Step 6: Clustering
        logger.info("Step 6: Clustering")
        clusters = await self.clustering_engine.cluster_papers(extracted_papers)

        # Step 7: Knowledge Graph Generation
        logger.info("Step 7: Knowledge Graph Generation")
        knowledge_graph = await self.knowledge_graph_generator.generate_graph(
            extracted_papers, clusters
        )

        # Step 8: Reading Path Generation
        logger.info("Step 8: Reading Path Generation")
        reading_paths = await self.reading_path_agent.generate_paths(
            extracted_papers, clusters, knowledge_graph
        )

        # Step 9: Research Gap Detection
        logger.info("Step 9: Research Gap Detection")
        research_gaps = await self.research_gap_detector.detect_gaps(
            extracted_papers, clusters, synthesis_result
        )

        # Step 10: Research Chat Agent (initialized for later use)
        logger.info("Step 10: Research Chat Agent initialized")

        # Compile results
        results = {
            "query": query,
            "query_understanding": query_understanding_result,
            "papers": papers,
            "reranked_papers": reranked_papers,
            "extracted_papers": extracted_papers,
            "synthesis": synthesis_result,
            "clusters": clusters,
            "knowledge_graph": knowledge_graph,
            "reading_paths": reading_paths,
            "research_gaps": research_gaps,
        }

        logger.info("Research pipeline completed")
        return results