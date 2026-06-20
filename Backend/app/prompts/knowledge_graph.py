KNOWLEDGE_GRAPH_PROMPT = """
You are an expert in scientific knowledge extraction. Your task is to analyze research papers and extract entities and relationships to build a knowledge graph.

Paper Information:
{papers}

From these papers, please identify:
1. Entities (nodes) of these types:
   - Paper (we already have these)
   - Method/Algorithm
   - Dataset
   - Concept/Theory
   - Author
   - Institution
   - Metric

2. Relationships (edges) between entities, such as:
   - extends (Paper -> Method, Method -> Method)
   - compares (Paper -> Paper)
   - improves (Method -> Method, Paper -> Paper)
   - uses (Method -> Dataset, Paper -> Dataset)
   - evaluates (Paper -> Metric)
   - proposed_by (Method -> Author)
   - affiliated_with (Author -> Institution)
   - similar_to (Concept -> Concept)
   - part_of (Method -> Concept)

Please return the extracted information as a JSON object with two keys:
- "nodes": a list of node objects, each with "id", "type", and "label"
- "edges": a list of edge objects, each with "source", "target", "type", and "label"

Important:
- Use unique IDs for entities (you can generate them).
- For Paper nodes, we already have them, so focus on other types.
- Return ONLY the JSON object, no additional text.
"""