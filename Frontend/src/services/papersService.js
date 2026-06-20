import api from './api'

export async function listPapers({ skip = 0, limit = 24, search = '' } = {}) {
  const { data } = await api.get('/papers/', { params: { skip, limit, search: search || undefined } })
  return data // PaperSearchResult { papers, total, page, size, pages }
}

export async function getPaperById(paperId) {
  const { data } = await api.get(`/papers/${paperId}`)
  return data
}

export async function getPaperByArxivId(arxivId) {
  const { data } = await api.get(`/papers/arxiv/${arxivId}`)
  return data
}

export default { listPapers, getPaperById, getPaperByArxivId }
