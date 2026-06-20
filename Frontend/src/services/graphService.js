import api from './api'

export async function getKnowledgeGraph(searchId) {
  const { data } = await api.get(`/graphs/${searchId}`)
  return data // { nodes, edges, node_count, edge_count }
}

export default { getKnowledgeGraph }
