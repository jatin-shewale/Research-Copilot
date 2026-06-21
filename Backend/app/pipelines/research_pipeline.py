from collections import Counter
import logging
import re
from typing import Any, Dict, List

from app.agents.paper_retrieval import PaperRetrievalAgent

logger = logging.getLogger(__name__)


def _tokenize(text: str) -> List[str]:
    return re.findall(r"[a-z0-9]+", (text or "").lower())


def _normalize_query(query: str) -> Dict[str, Any]:
    tokens = [token for token in _tokenize(query) if len(token) > 2]
    if not tokens:
        tokens = [query.lower().strip() or "research"]
    unique_tokens = list(dict.fromkeys(tokens))
    return {
        "topic": query.strip() or "Research topic",
        "subtopics": unique_tokens[:5],
        "related_topics": unique_tokens[1:6],
        "search_queries": [query.strip() or "research"],
    }


def _score_paper(paper: Dict[str, Any], query_tokens: List[str]) -> float:
    text = " ".join(
        str(paper.get(field, "") or "")
        for field in ("title", "abstract", "categories")
    ).lower()
    tokens = set(_tokenize(text))
    if not tokens or not query_tokens:
        return 0.0

    overlap = sum(1 for token in query_tokens if token in tokens)
    title_bonus = sum(1 for token in query_tokens if token in _tokenize(paper.get("title", "")))
    density = overlap / max(len(query_tokens), 1)
    return overlap + (title_bonus * 0.5) + density


def _light_extract(paper: Dict[str, Any]) -> Dict[str, Any]:
    abstract = str(paper.get("abstract", "") or "").strip()
    sentences = [part.strip() for part in re.split(r"(?<=[.!?])\s+", abstract) if part.strip()]
    summary = sentences[0] if sentences else abstract[:280]
    method_hint = sentences[1] if len(sentences) > 1 else None

    return {
        "problem": summary[:500] if summary else None,
        "motivation": None,
        "method": method_hint[:500] if method_hint else None,
        "datasets": None,
        "architecture": None,
        "training_strategy": None,
        "evaluation": None,
        "results": None,
        "limitations": None,
        "future_work": None,
        "contribution": None,
        "summary": summary[:500] if summary else None,
    }


def _build_synthesis(papers: List[Dict[str, Any]]) -> Dict[str, Any]:
    top_titles = [paper.get("title", "Untitled") for paper in papers[:5]]
    authors = []
    for paper in papers[:5]:
        authors.extend(paper.get("authors", []) or [])
    author_counts = Counter(authors)

    return {
        "major_clusters": ["Retrieval-focused papers", "Fast relevance-ranked results"],
        "key_methods": ["Keyword overlap ranking", "Abstract-first summarization"],
        "research_directions": top_titles[:3],
        "emerging_trends": top_titles[3:5],
        "important_authors": [f"{name} ({count})" for name, count in author_counts.most_common(5)],
        "important_papers": [
            f"{paper.get('title', 'Untitled')} - {paper.get('arxiv_id', 'n/a')}"
            for paper in papers[:5]
        ],
        "controversies": [],
        "limitations": [
            "Fast mode skips deep multi-stage synthesis to keep the response snappy.",
            "Results are based on retrieved abstracts and titles.",
        ],
        "open_problems": [
            "Expand with deeper synthesis after the first response.",
            "Add richer extracted metadata when the user opens a paper.",
        ],
    }


def _build_clusters(papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not papers:
        return []

    midpoint = max(1, len(papers) // 2)
    groups = [
        ("Top matches", papers[:midpoint]),
        ("Additional matches", papers[midpoint:]),
    ]

    clusters = []
    for idx, (name, group) in enumerate(groups):
        if not group:
            continue
        clusters.append(
            {
                "id": idx,
                "name": name,
                "paper_count": len(group),
                "papers": group,
            }
        )
    return clusters


def _build_graph(papers: List[Dict[str, Any]], query: str, clusters: List[Dict[str, Any]]) -> Dict[str, Any]:
    nodes: List[Dict[str, Any]] = [
        {
            "id": "topic_root",
            "type": "topic",
            "data": {
                "label": query,
                "title": query,
                "abstract": "",
                "authors": [],
                "paper_count": len(papers),
            },
        }
    ]
    edges: List[Dict[str, Any]] = []

    for paper in papers[:15]:
        paper_id = f"paper_{paper.get('arxiv_id', paper.get('id', 'unknown'))}"
        nodes.append(
            {
                "id": paper_id,
                "type": "paper",
                "data": {
                    "label": paper.get("title", paper_id),
                    "title": paper.get("title", ""),
                    "arxiv_id": paper.get("arxiv_id", ""),
                    "authors": paper.get("authors", []),
                    "abstract": paper.get("abstract", ""),
                    "url": paper.get("pdf_url", ""),
                },
            }
        )
        edges.append(
            {
                "id": f"e_topic_{paper_id}",
                "source": "topic_root",
                "target": paper_id,
                "type": "relevant_to",
                "label": "relevant_to",
            }
        )

    for cluster in clusters:
        cluster_id = f"cluster_{cluster['id']}"
        nodes.append(
            {
                "id": cluster_id,
                "type": "cluster",
                "data": {
                    "label": cluster.get("name", cluster_id),
                    "title": cluster.get("name", cluster_id),
                    "paper_count": cluster.get("paper_count", 0),
                    "authors": [],
                    "abstract": "",
                    "url": "",
                },
            }
        )

    return {
        "nodes": nodes,
        "edges": edges,
        "node_count": len(nodes),
        "edge_count": len(edges),
    }


def _build_reading_paths(papers: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    sorted_papers = sorted(papers, key=lambda x: x.get("similarity_score", 0), reverse=True)
    if not sorted_papers:
        return {"beginner": [], "intermediate": [], "researcher": []}

    third = max(1, len(sorted_papers) // 3)
    return {
        "beginner": sorted_papers[:third],
        "intermediate": sorted_papers[third: 2 * third],
        "researcher": sorted_papers[2 * third:],
    }


def _build_gaps(papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not papers:
        return [
            {
                "description": "No papers were retrieved, so no gaps could be inferred.",
                "type": "data_insufficient",
                "confidence": 0.2,
                "supporting_papers": [],
            }
        ]

    return [
        {
            "description": "The fast pipeline surfaces abstracts quickly, but deeper full-text synthesis is still pending.",
            "type": "surface_level_analysis",
            "confidence": 0.55,
            "supporting_papers": [paper.get("title", "Untitled") for paper in papers[:3]],
        }
    ]


class ResearchPipeline:
    def __init__(self):
        self.paper_retrieval = PaperRetrievalAgent()

    async def run(self, query: str) -> Dict[str, Any]:
        """
        Run a fast research pipeline.
        The initial response prioritizes speed by using lightweight heuristics
        and avoiding multi-step LLM synthesis during the first pass.
        """
        logger.info("Starting fast research pipeline for query: %s", query)

        query_understanding_result = _normalize_query(query)

        logger.info("Step 1: Paper Retrieval")
        papers = await self.paper_retrieval.retrieve_papers(query_understanding_result["search_queries"])
        papers = papers[:12]

        logger.info("Step 2: Fast Ranking")
        query_tokens = _tokenize(query)
        ranked_papers = sorted(
            papers,
            key=lambda paper: _score_paper(paper, query_tokens),
            reverse=True,
        )
        for paper in ranked_papers:
            paper["similarity_score"] = _score_paper(paper, query_tokens)

        logger.info("Step 3: Lightweight Extraction")
        extracted_papers = []
        for paper in ranked_papers:
            paper_copy = paper.copy()
            paper_copy.update(_light_extract(paper_copy))
            extracted_papers.append(paper_copy)

        logger.info("Step 4: Lightweight Synthesis")
        synthesis_result = _build_synthesis(extracted_papers)

        logger.info("Step 5: Lightweight Clustering")
        clusters = _build_clusters(extracted_papers)

        logger.info("Step 6: Knowledge Graph")
        knowledge_graph = _build_graph(extracted_papers, query, clusters)

        logger.info("Step 7: Reading Paths")
        reading_paths = _build_reading_paths(extracted_papers)

        logger.info("Step 8: Research Gaps")
        research_gaps = _build_gaps(extracted_papers)

        results = {
            "query": query,
            "mode": "fast",
            "query_understanding": query_understanding_result,
            "papers": papers,
            "reranked_papers": ranked_papers,
            "extracted_papers": extracted_papers,
            "synthesis": synthesis_result,
            "clusters": clusters,
            "knowledge_graph": knowledge_graph,
            "reading_paths": reading_paths,
            "research_gaps": research_gaps,
        }

        logger.info("Fast research pipeline completed with %s papers", len(extracted_papers))
        return results
