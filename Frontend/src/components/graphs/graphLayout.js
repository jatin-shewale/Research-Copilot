/**
 * Lightweight radial layout: cluster nodes are arranged in an outer ring,
 * and each cluster's connected paper nodes are arranged around it.
 * Avoids pulling in a heavy layout library while still producing a
 * readable, non-overlapping graph for typical result sizes (~30-150 nodes).
 */
export function layoutGraph(nodes, edges) {
  const clusterNodes = nodes.filter((n) => n.type === 'cluster')
  const paperNodes = nodes.filter((n) => n.type !== 'cluster')

  const adjacency = {}
  edges.forEach((e) => {
    adjacency[e.source] = adjacency[e.source] || []
    adjacency[e.source].push(e.target)
    adjacency[e.target] = adjacency[e.target] || []
    adjacency[e.target].push(e.source)
  })

  const positioned = {}
  const clusterCount = Math.max(clusterNodes.length, 1)
  const clusterRingRadius = Math.max(320, clusterCount * 110)

  clusterNodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / clusterCount
    const x = clusterRingRadius * Math.cos(angle)
    const y = clusterRingRadius * Math.sin(angle)
    positioned[node.id] = { x, y }
  })

  // Group orphan papers (not linked to any cluster) into a center cloud
  const assignedPapers = new Set()
  clusterNodes.forEach((cluster) => {
    const linkedPaperIds = (adjacency[cluster.id] || []).filter((id) =>
      paperNodes.some((p) => p.id === id)
    )
    const center = positioned[cluster.id]
    const radius = 190
    linkedPaperIds.forEach((paperId, i) => {
      assignedPapers.add(paperId)
      const angle = (2 * Math.PI * i) / Math.max(linkedPaperIds.length, 1)
      positioned[paperId] = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      }
    })
  })

  const orphanPapers = paperNodes.filter((p) => !assignedPapers.has(p.id))
  orphanPapers.forEach((node, i) => {
    const cols = Math.ceil(Math.sqrt(orphanPapers.length))
    const col = i % cols
    const row = Math.floor(i / cols)
    positioned[node.id] = { x: (col - cols / 2) * 260, y: (row - cols / 2) * 180 }
  })

  return nodes.map((n) => ({
    ...n,
    position: positioned[n.id] || { x: Math.random() * 600, y: Math.random() * 600 },
  }))
}
