import { Link, useNavigate } from 'react-router-dom'
import { FiFileText, FiLayers, FiShare2, FiTrendingUp, FiSearch, FiArrowRight, FiClock } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import StatCard from '../../components/cards/StatCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import EmptyState from '../../components/ui/EmptyState'
import SearchBar from '../../components/search/SearchBar'
import AnalyticsAreaChart from '../../components/charts/AnalyticsAreaChart'
import AnalyticsPieChart from '../../components/charts/AnalyticsPieChart'
import Badge from '../../components/ui/Badge'
import useResearchPipeline from '../../hooks/useResearchPipeline'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import { useSearchStore } from '../../store/searchStore'
import { timeAgo } from '../../utils/formatters'

function buildActivitySeries(history) {
  const byDay = {}
  ;(history || []).forEach((h) => {
    const d = h.created_at ? new Date(h.created_at) : null
    if (!d) return
    const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    byDay[key] = (byDay[key] || 0) + 1
  })
  return Object.entries(byDay).map(([name, value]) => ({ name, value }))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data: analytics, isLoading: loadingAnalytics, isError: analyticsError, refetch: refetchAnalytics } = useAnalytics()
  const { data: history, isLoading: loadingHistory } = useSearchHistory()
  const resumeSearch = useSearchStore((s) => s.startSearch)
  const { run, status: pipelineStatus } = useResearchPipeline()

  const series = buildActivitySeries(history)
  const statusBreakdown = ['completed', 'processing', 'failed'].map((status) => ({
    name: status,
    value: (history || []).filter((h) => h.status === status).length,
  })).filter((d) => d.value > 0)

  const handleResume = (item) => {
    resumeSearch({ searchId: item.id || item.search_id, query: item.query })
    navigate(`/search?id=${item.id || item.search_id}`)
  }

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Your research activity, processed papers, and generated maps at a glance."
          actions={
            <Link to="/search" className="btn-primary">
              <FiSearch className="h-4 w-4" /> New Research
            </Link>
          }
        />

        <div className="mt-8 card-surface p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-1">
            <h3 className="font-display text-base font-semibold text-text">Quick Research</h3>
            <p className="text-sm text-muted">Start a new search from the dashboard without leaving the page.</p>
          </div>
          <SearchBar
            onSearch={run}
            loading={pipelineStatus === 'processing'}
            size="lg"
            className="max-w-5xl"
          />
        </div>

        {analyticsError ? (
          <div className="mt-8">
            <ErrorState message="Could not load analytics from the backend." onRetry={refetchAnalytics} />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {loadingAnalytics
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : [
                  { icon: FiFileText, label: 'Papers Processed', value: analytics?.papers_processed ?? 0, tone: 'primary' },
                  { icon: FiTrendingUp, label: 'Topics Explored', value: analytics?.topics_explored ?? 0, tone: 'secondary' },
                  { icon: FiLayers, label: 'Clusters Created', value: analytics?.clusters_created ?? 0, tone: 'accent' },
                  { icon: FiShare2, label: 'Research Maps Generated', value: analytics?.research_maps_generated ?? 0, tone: 'success' },
                ].map((stat, i) => <StatCard key={stat.label} {...stat} delay={i * 0.05} />)}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-text">Activity Timeline</h3>
            <p className="text-sm text-muted">Research queries run over time</p>
            <div className="mt-4">
              {series.length > 0 ? (
                <AnalyticsAreaChart data={series} color="#6366F1" />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-muted">No activity yet</div>
              )}
            </div>
          </div>

          <div className="card-surface p-6">
            <h3 className="font-display text-base font-semibold text-text">Search Status Breakdown</h3>
            <p className="text-sm text-muted">Outcome of recent runs</p>
            <div className="mt-2">
              {statusBreakdown.length > 0 ? (
                <AnalyticsPieChart data={statusBreakdown} height={220} />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted">No data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 font-display text-base font-semibold text-text">Recent Searches</h3>
          {loadingHistory ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="p-4" />)}
            </div>
          ) : history?.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {history.slice(0, 8).map((item) => (
                <button
                  key={item.id || item.search_id}
                  onClick={() => handleResume(item)}
                  className="card-surface flex items-center justify-between gap-3 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-text">{item.query}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <FiClock className="h-3 w-3" /> {timeAgo(item.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={item.status === 'completed' ? 'success' : item.status === 'failed' ? 'danger' : 'warning'}>
                      {item.status}
                    </Badge>
                    <FiArrowRight className="h-4 w-4 text-muted" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FiSearch}
              title="No searches yet"
              description="Run your first research query to see it appear here."
              action={<Link to="/search" className="btn-primary">Start Researching</Link>}
            />
          )}
        </div>
      </div>
    </PageTransition>
  )
}
