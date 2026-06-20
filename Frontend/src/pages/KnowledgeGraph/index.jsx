import { useState } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import KnowledgeGraphView from '../../components/graphs/KnowledgeGraphView'
import NoActiveSearch from '../../components/search/NoActiveSearch'
import Tabs from '../../components/ui/Tabs'
import EmptyState from '../../components/ui/EmptyState'
import { useSearchStore } from '../../store/searchStore'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'paper', label: 'Papers' },
  { key: 'cluster', label: 'Clusters' },
]

export default function KnowledgeGraphPage() {
  const { status, results, query } = useSearchStore()
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (status !== 'completed' || !results) {
    return (
      <PageTransition>
        <div className="container-page py-16">
          <NoActiveSearch description="The interactive knowledge graph — papers, clusters, and how they relate — is generated once a research run finishes." />
        </div>
      </PageTransition>
    )
  }

  const graph = results.knowledge_graph

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Knowledge Graph"
          title={`Graph for “${results.query || query}”`}
          description={graph ? `${graph.node_count ?? graph.nodes?.length ?? 0} nodes · ${graph.edge_count ?? graph.edges?.length ?? 0} relationships` : ''}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tabs={FILTERS} active={filterType} onChange={setFilterType} />
          <div className="relative w-full sm:w-72">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nodes by title…"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="mt-6">
          {graph?.nodes?.length ? (
            <KnowledgeGraphView graph={graph} filterType={filterType} searchTerm={searchTerm} />
          ) : (
            <EmptyState icon={FiFilter} title="No graph data" description="This research run did not produce a knowledge graph." />
          )}
        </div>

        <p className="mt-4 text-xs text-muted">
          Tip: scroll to zoom, drag to pan, and click any node to inspect its details in the side panel.
        </p>
      </div>
    </PageTransition>
  )
}
