CLUSTER_NAMING_PROMPT = """
You are an expert in scientific research trends. Your task is to generate a concise, descriptive name for a cluster of research papers based on their characteristics.

Here are the papers in this cluster:

{papers}

Based on these papers, please provide a short, informative name that captures the common theme, methodology, or focus of this cluster. The name should be suitable for a research topic label (e.g., "Graph RAG", "Fusion Retrieval", "Multimodal Reasoning").

Guidelines:
- The name should be 1-5 words long.
- Use terminology commonly found in the papers.
- Focus on the most distinctive aspect of the cluster.
- Return ONLY the cluster name, no additional text or explanation.
- If you cannot determine a clear theme, return a generic name like "Research Cluster".

Cluster Name:
"""