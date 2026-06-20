import logging
import numpy as np
from typing import List, Dict, Any
import hdbscan
from sklearn.cluster import KMeans
from app.utils.embedding import get_embeddings
from app.utils.llm import call_llm
from app.prompts.cluster_naming import CLUSTER_NAMING_PROMPT

logger = logging.getLogger(__name__)

class ClusteringEngine:
    def __init__(self, min_cluster_size: int = 5, min_samples: int = 1):
        self.min_cluster_size = min_cluster_size
        self.min_samples = min_samples

    async def cluster_papers(self, papers: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Cluster papers based on their embeddings.
        Returns a list of clusters, each containing papers and a generated name.
        """
        logger.info(f"Clustering {len(papers)} papers")

        if len(papers) < self.min_cluster_size:
            logger.warning("Not enough papers for clustering")
            return []

        # Get embeddings for paper abstracts
        abstracts = [paper.get('abstract', '') for paper in papers]
        try:
            embeddings = await get_embeddings(abstracts)
            embeddings = np.array(embeddings)
        except Exception as e:
            logger.error(f"Error generating embeddings for clustering: {e}")
            return []

        # Perform clustering using HDBSCAN
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=self.min_cluster_size,
            min_samples=self.min_samples,
            metric='euclidean',
            cluster_selection_method='eom'
        )
        cluster_labels = clusterer.fit_predict(embeddings)

        # Group papers by cluster
        clusters = {}
        for idx, label in enumerate(cluster_labels):
            if label == -1:  # Noise point
                continue
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(papers[idx])

        logger.info(f"Found {len(clusters)} clusters")

        # Generate names for each cluster
        cluster_list = []
        for cluster_id, cluster_papers in clusters.items():
            try:
                cluster_name = await self._generate_cluster_name(cluster_papers)
            except Exception as e:
                logger.error(f"Error generating cluster name: {e}")
                cluster_name = f"Cluster {cluster_id}"

            cluster_list.append({
                "id": int(cluster_id),
                "name": cluster_name,
                "paper_count": len(cluster_papers),
                "papers": cluster_papers
            })

        # Sort by paper count (descending)
        cluster_list.sort(key=lambda x: x['paper_count'], reverse=True)
        return cluster_list

    async def _generate_cluster_name(self, papers: List[Dict[str, Any]]) -> str:
        """
        Generate a descriptive name for a cluster based on its papers.
        """
        # Prepare paper information for the prompt
        paper_info = []
        for paper in papers[:5]:  # Limit to 5 papers for the prompt
            info = f"- Title: {paper.get('title', 'N/A')}"
            if paper.get('method'):
                info += f"\n  Method: {paper.get('method', 'N/A')[:100]}..."
            paper_info.append(info)

        papers_text = "\n".join(paper_info)

        # Prepare the prompt
        prompt = CLUSTER_NAMING_PROMPT.format(papers=papers_text)

        # Call LLM
        try:
            response = await call_llm(prompt, temperature=0.5)
            # Extract the cluster name from the response (assuming it's just the name)
            cluster_name = response.strip().strip('"')
            return cluster_name if cluster_name else f"Cluster {len(papers)}"
        except Exception as e:
            logger.error(f"Error calling LLM for cluster naming: {e}")
            return f"Cluster {len(papers)}"