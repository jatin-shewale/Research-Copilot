QUERY_UNDERSTANDING_PROMPT = """
You are an expert research assistant. Your task is to analyze the user's research query and extract key information to guide the literature search process.

User Query: "{query}"

Please provide:
1. The main research topic (refined from the query)
2. A list of relevant subtopics (3-5)
3. A list of related research domains or fields (3-5)
4. A list of specific search queries to use for paper retrieval (5-10)

Format your response as a JSON object with the following keys:
- topic: string (the main research topic)
- subtopics: list of strings
- related_topics: list of strings
- search_queries: list of strings

Make sure the search queries are specific, varied, and likely to return relevant papers from arXiv.
Consider different phrasings, acronyms, and related concepts.
"""