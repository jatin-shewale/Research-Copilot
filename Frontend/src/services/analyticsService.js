import api from './api'

export async function getAnalytics() {
  const { data } = await api.get('/analytics/')
  return data // { papers_processed, topics_explored, clusters_created, research_maps_generated, user_activity }
}

export default { getAnalytics }
