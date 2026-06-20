CROSS_PAPER_SYNTHESIS_PROMPT = """
You are an expert research analyst specializing in scientific literature synthesis. Your task is to analyze a collection of research papers and generate a comprehensive research landscape.

Here are the paper details (title, authors, abstract, and extracted information):

{papers}

Based on this collection, please provide a research landscape analysis in the following JSON format:

{{
  "major_clusters": [
    "Cluster 1 description",
    "Cluster 2 description",
    ...
  ],
  "key_methods": [
    "Method 1 description",
    "Method 2 description",
    ...
  ],
  "research_directions": [
    "Direction 1 description",
    "Direction 2 description",
    ...
  ],
  "emerging_trends": [
    "Trend 1 description",
    "Trend 2 description",
    ...
  ],
  "important_authors": [
    "Author Name 1 (brief reason)",
    "Author Name 2 (brief reason)",
    ...
  ],
  "important_papers": [
    "Paper Title 1 - arXivID (brief reason)",
    "Paper Title 2 - arXivID (brief reason)",
    ...
  ],
  "controversies": [
    "Controversy 1 description",
    "Controversy 2 description",
    ...
  ],
  "limitations": [
    "Limitation 1 description",
    "Limitation 2 description",
    ...
  ],
  "open_problems": [
    "Open Problem 1 description",
    "Open Problem 2 description",
    ...
  ]
}}

Guidelines:
- major_clusters: Identify 3-5 major thematic clusters or schools of thought in the literature.
- key_methods: List 3-5 key methodologies or approaches that appear frequently.
- research_directions: Describe 3-5 current research directions being pursued.
- emerging_trends: Identify 2-4 emerging trends that are gaining traction.
- important_authors: List 3-5 authors who appear frequently or have influential works (include brief reason).
- important_papers: List 3-5 papers that seem particularly influential or well-cited (include arXiv ID and brief reason).
- controversies: Note any known debates, contradictions, or conflicting findings in the literature.
- limitations: List common limitations across the papers (e.g., dataset issues, methodological constraints).
- open_problems: Identify 3-5 open problems or research gaps that are not adequately addressed.

Important:
- Return ONLY the JSON object, no additional text.
- If information is not discernible from the papers, return empty arrays for that field.
- Be concise but insightful in your descriptions.
"""