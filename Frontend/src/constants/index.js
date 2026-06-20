export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const APP_NAME = 'Research Copilot'

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Search', path: '/search' },
  { label: 'Landscape', path: '/landscape' },
  { label: 'Knowledge Graph', path: '/knowledge-graph' },
  { label: 'Reading Map', path: '/reading-map' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Chat', path: '/chat' },
  { label: 'Settings', path: '/settings' },
]

export const PIPELINE_STAGES = [
  { key: 'query_understanding', label: 'Query Understanding', description: 'Parsing intent and generating search strategies' },
  { key: 'paper_retrieval', label: 'Paper Retrieval', description: 'Fetching candidate papers from arXiv' },
  { key: 'semantic_reranking', label: 'Semantic Reranking', description: 'Ranking papers by relevance to your query' },
  { key: 'paper_extraction', label: 'Paper Extraction', description: 'Extracting methods, results & contributions' },
  { key: 'cross_paper_synthesis', label: 'Cross-Paper Synthesis', description: 'Synthesizing the research landscape' },
  { key: 'clustering', label: 'Clustering', description: 'Grouping papers into research themes' },
  { key: 'knowledge_graph', label: 'Knowledge Graph', description: 'Building the paper-cluster relationship graph' },
  { key: 'reading_path', label: 'Reading Path', description: 'Designing a guided learning journey' },
  { key: 'research_gaps', label: 'Gap Detection', description: 'Identifying open problems & opportunities' },
]

export const READING_LEVELS = [
  { key: 'beginner', label: 'Beginner', description: 'Foundational papers to build intuition', color: '#22C55E' },
  { key: 'intermediate', label: 'Intermediate', description: 'Core methods and architectures', color: '#6366F1' },
  { key: 'researcher', label: 'Researcher', description: 'Frontier work & open problems', color: '#A78BFA' },
]

export const SEARCH_SUGGESTIONS = [
  'Retrieval-Augmented Generation',
  'Graph RAG',
  'LLM Agents',
  'Diffusion Models',
  'Vision Transformers',
  'Mixture of Experts',
  'State Space Models',
  'Constitutional AI',
]

export const SEARCH_POLL_INTERVAL_MS = 2500
export const SEARCH_POLL_TIMEOUT_MS = 6 * 60 * 1000
