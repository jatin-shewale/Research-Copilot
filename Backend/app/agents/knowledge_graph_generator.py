import logging
from typing import List, Dict, Any
import networkx as nx
import json
from app.utils.llm import call_llm
from app.prompts.knowledge_graph import KNOWLEDGE_GRAPH_PROMPT

logger = logging.getLogger(__name__)

class KnowledgeGraphGenerator:
    def __init__(self):
        pass

    async def generate_graph(self, papers: List[Dict[str, Any]], clusters: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate a knowledge graph from the papers and clusters.
        Returns a dictionary representing the graph (nodes and edges) suitable for visualization.
        """
        logger.info(f"Generating knowledge graph from {len(papers)} papers and {len(clusters)} clusters")

        # Initialize an empty graph
        G = nx.Graph()

        # Add paper nodes
        for paper in papers:
            paper_id = f"paper_{paper.get('arxiv_id', paper.get('id', 'unknown'))}"
            G.add_node(
                paper_id,
                type="paper",
                title=paper.get('title', ''),
                arxiv_id=paper.get('arxiv_id', ''),
                authors=paper.get('authors', []),
                abstract=paper.get('abstract', ''),
                url=paper.get('pdf_url', '')
            )

        # We'll extract entities and relationships using LLM
        # For now, we'll create a simplified graph based on co-occurrence
        # In a full implementation, we would use NLP to extract entities and relations

        # For demonstration, let's add some cluster nodes and connect papers to clusters
        for cluster in clusters:
            cluster_id = f"cluster_{cluster['id']}"
            G.add_node(
                cluster_id,
                type="cluster",
                name=cluster.get('name', f"Cluster {cluster['id']}"),
                paper_count=cluster.get('paper_count', 0)
            )

            # Connect papers in this cluster to the cluster node
            for paper in cluster.get('papers', []):
                paper_id = f"paper_{paper.get('arxiv_id', paper.get('id', 'unknown'))}"
                if G.has_node(paper_id):
                    G.add_edge(paper_id, cluster_id, relationship="belongs_to")

        # Convert the graph to a format suitable for frontend (e.g., React Flow)
        nodes = []
        edges = []

        for node_id, node_data in G.nodes(data=True):
            nodes.append({
                "id": node_id,
                "type": node_data.get("type", "unknown"),
                "data": {
                    "label": node_data.get("title", node_data.get("name", node_id)),
                    "title": node_data.get("title", ""),
                    "arxiv_id": node_data.get("arxiv_id", ""),
                    "authors": node_data.get("authors", []),
                    "abstract": node_data.get("abstract", ""),
                    "url": node_data.get("url", ""),
                    "paper_count": node_data.get("paper_count", 0)
                }
            })

        for source, target, edge_data in G.edges(data=True):
            edges.append({
                "id": f"e_{source}_{target}",
                "source": source,
                "target": target,
                "type": edge_data.get("relationship", "related"),
                "label": edge_data.get("relationship", "related")
            })

        # Return the graph data
        return {
            "nodes": nodes,
            "edges": edges,
            "node_count": len(nodes),
            "edge_count": len(edges)
        }