import { FiUsers, FiTrendingUp, FiBookOpen, FiCompass } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import ClusterCard from '../../components/cards/ClusterCard'
import GapCard from '../../components/cards/GapCard'
import PaperGrid from '../../components/papers/PaperGrid'
import NoActiveSearch from '../../components/search/NoActiveSearch'
import Badge from '../../components/ui/Badge'
import { useSearchStore } from '../../store/searchStore'
import { useState } from 'react'
import PaperDetailModal from '../../components/papers/PaperDetailModal'
import { StaggerGroup, StaggerItem } from '../../components/animations/StaggerGroup'

export default function LandscapePage() {
  const { status, results, query } = useSearchStore()
  const [openPaper, setOpenPaper] = useState(null)

  if (status !== 'completed' || !results) {
    return (
      <PageTransition>
        <div className="container-page py-16">
          <NoActiveSearch description="The research landscape — clusters, trends, top authors, key papers and gaps — is generated once a research run finishes." />
        </div>
      </PageTransition>
    )
  }

  const clusters = results.clusters || []
  const gaps = results.research_gaps || []
  const synthesis = results.synthesis || {}
  const papers = results.extracted_papers || results.reranked_papers || []

  // Top authors derived client-side from the retrieved papers.
  const authorCounts = {}
  papers.forEach((p) => {
    ;(Array.isArray(p.authors) ? p.authors : []).forEach((a) => {
      const name = typeof a === 'string' ? a : a?.name
      if (!name) return
      authorCounts[name] = (authorCounts[name] || 0) + 1
    })
  })
  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Research Landscape"
          title={`Landscape for “${results.query || query}”`}
          description="A synthesized overview of the field: clusters, trends, top contributors, and open problems."
        />

        {synthesis?.summary && (
          <div className="card-surface mt-8 p-6">
            <h3 className="font-display text-base font-semibold text-text">Research Summary</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{synthesis.summary}</p>
          </div>
        )}

        {synthesis?.emerging_trends?.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-text">
              <FiTrendingUp className="h-4 w-4 text-primary" /> Emerging Trends
            </h3>
            <div className="flex flex-wrap gap-2">
              {synthesis.emerging_trends.map((t, i) => (
                <Badge key={i} tone="accent">{t}</Badge>
              ))}
            </div>
          </div>
        )}

        {clusters.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 font-display text-base font-semibold text-text">Research Clusters</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {clusters.map((c, i) => (
                <ClusterCard key={c.id || c.name || i} cluster={c} index={i} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topAuthors.length > 0 && (
            <div className="card-surface p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-text">
                <FiUsers className="h-4 w-4 text-primary" /> Top Authors
              </h3>
              <div className="space-y-3">
                {topAuthors.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-text">{name}</span>
                    <Badge>{count} paper{count > 1 ? 's' : ''}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(synthesis.future_directions?.length > 0 || synthesis.open_problems?.length > 0) && (
            <div className="card-surface p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-text">
                <FiCompass className="h-4 w-4 text-primary" /> Open Problems &amp; Future Directions
              </h3>
              <ul className="space-y-3">
                {[...(synthesis.open_problems || []), ...(synthesis.future_directions || [])].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-6 text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {gaps.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 font-display text-base font-semibold text-text">Gap Analysis</h3>
            <div className="space-y-3">
              {gaps.map((g, i) => <GapCard key={i} gap={g} index={i} />)}
            </div>
          </div>
        )}

        {papers.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-text">
              <FiBookOpen className="h-4 w-4 text-primary" /> Key Papers
            </h3>
            <StaggerGroup>
              <PaperGrid papers={papers.slice(0, 9)} onOpen={setOpenPaper} ranked />
            </StaggerGroup>
          </div>
        )}

        <PaperDetailModal paper={openPaper} open={Boolean(openPaper)} onClose={() => setOpenPaper(null)} />
      </div>
    </PageTransition>
  )
}
