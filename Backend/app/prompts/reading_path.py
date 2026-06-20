READING_PATH_PROMPT = """
You are an expert research mentor. Your task is to create personalized reading paths for researchers at different experience levels based on a collection of papers.

Here are the papers (title, authors, abstract, and key extracted information):

{papers}

Please create three reading paths:
1. Beginner Path: For those new to the topic. Should start with foundational papers that introduce core concepts and gradually build up.
2. Intermediate Path: For those with some background. Should cover important developments and key methodologies.
3. Researcher Path: For experienced researchers. Should include the latest advancements, detailed methodologies, and open problems.

For each path, provide an ordered list of papers (from most foundational to most advanced) with brief reasoning for why each paper is included and why it comes at that position in the path.

Return the result as a JSON object with the following format:
{{
  "beginner": [
    {{
      "title": "Paper Title",
      "arxiv_id": "arXiv.ID",
      "reasoning": "Explanation of why this paper is included and its position in the path"
    }},
    ...
  ],
  "intermediate": [
    {{
      "title": "Paper Title",
      "arxiv_id": "arXiv.ID",
      "reasoning": "Explanation of why this paper is included and its position in the path"
    }},
    ...
  ],
  "researcher": [
    {{
      "title": "Paper Title",
      "arxiv_id": "arXiv.ID",
      "reasoning": "Explanation of why this paper is included and its position in the path"
    }},
    ...
  ]
}}

Guidelines:
- Each path should contain 3-5 papers (adjust based on available papers).
- Papers should not repeat across paths (though in reality they might, but for this exercise assign each paper to at most one path).
- Focus on logical progression: concepts -> methods -> applications -> advancements.
- Use the extracted information (problem, method, results) to inform your decisions.
- If information is missing for a paper, use what's available.
- Return ONLY the JSON object, no additional text.
"""