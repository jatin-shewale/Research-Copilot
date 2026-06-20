import { useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useEffect } from 'react'
import { nodeTypes } from './nodeTypes'
import { layoutGraph } from './graphLayout'
import NodeInspector from './NodeInspector'

function GraphCanvas({ graph, filterType, searchTerm, onSelectNode, selectedNodeId }) {
  const filteredRaw = useMemo(() => {
    let nodes = graph.nodes || []
    if (filterType !== 'all') nodes = nodes.filter((n) => n.type === filterType)
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase()
      nodes = nodes.filter((n) => (n.data?.label || '').toLowerCase().includes(t))
    }
    const ids = new Set(nodes.map((n) => n.id))
    const edges = (graph.edges || []).filter((e) => ids.has(e.source) && ids.has(e.target))
    return { nodes, edges }
  }, [graph, filterType, searchTerm])

  const laidOut = useMemo(() => layoutGraph(filteredRaw.nodes, filteredRaw.edges), [filteredRaw])

  const flowNodes = useMemo(
    () =>
      laidOut.map((n) => ({
        ...n,
        selected: n.id === selectedNodeId,
        style: undefined,
      })),
    [laidOut, selectedNodeId]
  )

  const flowEdges = useMemo(
    () =>
      filteredRaw.edges.map((e) => ({
        ...e,
        animated: e.type === 'belongs_to',
        style: { stroke: '#C7CCFB', strokeWidth: 1.5 },
        labelStyle: { fontSize: 10, fill: '#64748B' },
      })),
    [filteredRaw.edges]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  useEffect(() => setNodes(flowNodes), [flowNodes, setNodes])
  useEffect(() => setEdges(flowEdges), [flowEdges, setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => onSelectNode(node)}
      onPaneClick={() => onSelectNode(null)}
      fitView
      minZoom={0.15}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#E2E8F0" gap={24} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={(n) => (n.type === 'cluster' ? '#A78BFA' : '#6366F1')}
        maskColor="rgba(248,250,252,0.7)"
        pannable
        zoomable
      />
    </ReactFlow>
  )
}

export default function KnowledgeGraphView({ graph, filterType = 'all', searchTerm = '' }) {
  const [selected, setSelected] = useState(null)

  if (!graph || !graph.nodes?.length) return null

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-2xl border border-border bg-white">
      <ReactFlowProvider>
        <GraphCanvas
          graph={graph}
          filterType={filterType}
          searchTerm={searchTerm}
          onSelectNode={setSelected}
          selectedNodeId={selected?.id}
        />
      </ReactFlowProvider>
      <NodeInspector node={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
