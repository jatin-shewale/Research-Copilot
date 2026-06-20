import api from './api'

/**
 * Kicks off a full research pipeline run for the given query.
 * Backend runs this as an async background task; we get a search_id back
 * and poll /search/{search_id} until status is "completed" or "failed".
 */
export async function startResearch(query) {
  const { data } = await api.post('/search/', { user_id: 0, query, status: 'processing' })
  return data // { search_id, status }
}

export async function getSearchResult(searchId) {
  const { data } = await api.get(`/search/${searchId}`)
  return data // { status: 'processing' | 'completed' | 'failed', results?, error? }
}

export async function getSearchHistory() {
  const { data } = await api.get('/search/history')
  return data
}

const searchService = { startResearch, getSearchResult, getSearchHistory }
export default searchService
