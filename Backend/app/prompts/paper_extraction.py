PAPER_EXTRACTION_PROMPT = """
You are an expert scientific paper analyzer. Your task is to extract key information from the given paper title and abstract.

Paper Title: "{title}"
Paper Abstract: "{abstract}"

Please extract the following information and return it as a JSON object with these exact keys:

1. problem: What problem or challenge does this paper address? Be specific.
2. motivation: Why is this problem important? What motivates the research?
3. method: What approach or methodology does the paper propose? Describe the key technical contributions.
4. datasets: What datasets are used for experiments and evaluation? List them.
5. architecture: If applicable, describe the model architecture or system design.
6. training_strategy: How are models trained? Include details about loss functions, optimization, etc.
7. evaluation: How is the approach evaluated? What metrics and baselines are used?
8. results: What are the main findings and performance results?
9. limitations: What are the limitations of the approach or study?
10. future_work: What future directions do the authors suggest?
11. contribution: What are the key contributions of this paper? List them clearly.

Important guidelines:
- If information is not explicitly mentioned in the abstract, use null for that field.
- Be concise but informative.
- For lists (like datasets, contributions), provide them as arrays in the JSON.
- Ensure the output is valid JSON only, no additional text.
"""