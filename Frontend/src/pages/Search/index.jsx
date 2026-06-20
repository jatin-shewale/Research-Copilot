import { useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { FiShare2, FiMap, FiClock, FiMessageSquare, FiCompass, FiArrowRight } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import SearchBar from '../../components/search/SearchBar'
import PipelineProgress from '../../components/search/PipelineProgress'
import ErrorState from '../../components/ui/ErrorState'
import PaperGrid from '../../components/papers/PaperGrid'
import Badge from '../../components/ui/Badge'
import useResearchPipeline from '../../hooks/useResearchPipeline'
import { useSearchStore } from '../../store/searchStore'

const NEXT_STEPS = [
  { to: '/landscape', icon: FiCompass, label: 'Research Landscape' },
  { to: '/knowledge-graph', icon: FiShare2, label: 'Knowledge Graph' },
  { to: '/reading-map', icon: FiMap, label: 'Reading Map' },
  { to: '/timeline', icon: FiClock, label: 'Timeline' },
  { to: '/chat', icon: FiMessageSquare, label: 'Research Chat' },
]

export default function SearchPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const idFromUrl = params.get('id')
  const { run, resumePolling, status, results, error, query, searchId, activeStageIndex } = useResearchPipeline()

  useEffect(() => {
    // If we land on /search?id=XYZ without local state (e.g. page refresh),
    // resume polling that search instead of losing the session.
    if (idFromUrl && idFromUrl !== searchId && status === 'idle') {
      useSearchStore.getState().startSearch({ searchId: idFromUrl, query: useSearchStore.getState().query || 'Resumed research session' })
      resumePolling(idFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromUrl])

  const handleSearch = (q) => run(q)

  return (
    <PageTransition>
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Research</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">Start a new research run</h1>
          <p className="mt-3 text-sm text-muted">
            Describe what you want to understand. Research Copilot will retrieve, rank, extract and synthesize the relevant literature.
          </p>
          <div className="mt-8">
            <SearchBar onSearch={handleSearch} loading={status === 'processing'} initialValue={query} size="lg" />
          </div>
        </div>

        {status === 'idle' && (
          <div className="mx-auto mt-16 max-w-xl text-center text-sm text-muted">
            Your live pipeline status, retrieved papers, and quick links to every generated view will appear here once a search starts.
          </div>
        )}

        {status === 'failed' && (
          <div className="mx-auto mt-12 max-w-xl">
            <ErrorState title="The research pipeline failed" message={error} onRetry={() => query && run(query)} />
          </div>
        )}

        {(status === 'processing' || status === 'completed') && (
          <div className="mx-auto mt-12 max-w-3xl">
            {status === 'processing' && <PipelineProgress activeStageIndex={activeStageIndex} status={status} />}

            {status === 'completed' && results && (
              <div className="space-y-10">
                <div className="card-surface flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                  <div>
                    <Badge tone="success">Pipeline complete</Badge>
                    <h2 className="mt-2 font-display text-lg font-semibold text-text">
                      “{results.query || query}”
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {results.extracted_papers?.length || 0} papers analyzed · {results.clusters?.length || 0} clusters found
                    </p>
                  </div>
                  <button onClick={() => navigate('/landscape')} className="btn-primary shrink-0">
                    View Full Landscape <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Jump to a generated view</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {NEXT_STEPS.map((step) => (
                      <Link
                        key={step.to}
                        to={step.to}
                        className="card-surface flex flex-col items-center gap-2 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lift"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                          <step.icon className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-medium text-text">{step.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {results.reranked_papers?.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Top retrieved papers</h3>
                    <PaperGrid papers={results.reranked_papers.slice(0, 6)} ranked />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
