import { useState } from 'react'
import { FiClock, FiCheckCircle, FiBookOpen } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import NoActiveSearch from '../../components/search/NoActiveSearch'
import Tabs from '../../components/ui/Tabs'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import PaperDetailModal from '../../components/papers/PaperDetailModal'
import { motion } from 'framer-motion'
import { useSearchStore } from '../../store/searchStore'
import { READING_LEVELS } from '../../constants'
import { formatAuthors, truncate } from '../../utils/formatters'

export default function ReadingMapPage() {
  const { status, results, query } = useSearchStore()
  const [level, setLevel] = useState('beginner')
  const [openPaper, setOpenPaper] = useState(null)
  const [completed, setCompleted] = useState({})

  if (status !== 'completed' || !results) {
    return (
      <PageTransition>
        <div className="container-page py-16">
          <NoActiveSearch description="Your guided reading journey — beginner through researcher level — is generated once a research run finishes." />
        </div>
      </PageTransition>
    )
  }

  const paths = results.reading_paths || {}
  const currentPath = paths[level] || []
  const levelMeta = READING_LEVELS.find((l) => l.key === level)
  const completedCount = currentPath.filter((_, i) => completed[`${level}-${i}`]).length
  const progressPct = currentPath.length ? Math.round((completedCount / currentPath.length) * 100) : 0

  const toggleComplete = (i) => {
    const key = `${level}-${i}`
    setCompleted((c) => ({ ...c, [key]: !c[key] }))
  }

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Reading Map"
          title={`Learning journey for “${results.query || query}”`}
          description="A sequenced path through the literature — from foundational ideas to the research frontier."
        />

        <div className="mt-6">
          <Tabs
            tabs={READING_LEVELS.map((l) => ({ key: l.key, label: l.label }))}
            active={level}
            onChange={setLevel}
          />
        </div>

        {currentPath.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={FiBookOpen} title="No papers at this level" description="Try another level from the tabs above." />
          </div>
        ) : (
          <>
            <div className="card-surface mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-text">{levelMeta?.description}</p>
                <p className="mt-1 text-xs text-muted">{currentPath.length} papers · ~{currentPath.length * 25} min estimated reading time</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: levelMeta?.color }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted">{progressPct}%</span>
              </div>
            </div>

            <div className="relative mt-8 pl-8">
              <span className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-5">
                {currentPath.map((paper, i) => {
                  const isDone = completed[`${level}-${i}`]
                  return (
                    <motion.div
                      key={paper.arxiv_id || paper.title || i}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      <button
                        onClick={() => toggleComplete(i)}
                        className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background shadow-card"
                        style={{ backgroundColor: isDone ? levelMeta?.color : '#fff' }}
                        title="Mark as read"
                      >
                        {isDone && <FiCheckCircle className="h-3.5 w-3.5 text-white" />}
                      </button>
                      <div className={`card-surface p-5 ${isDone ? 'opacity-60' : ''}`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="primary">Step {i + 1}</Badge>
                          {paper.estimated_reading_time && (
                            <Badge icon={FiClock}>{paper.estimated_reading_time}</Badge>
                          )}
                        </div>
                        <button onClick={() => setOpenPaper(paper)} className="mt-2.5 text-left">
                          <h3 className="font-display text-[15px] font-semibold text-text hover:text-primary">{paper.title}</h3>
                        </button>
                        {paper.authors && <p className="mt-1 text-xs text-muted">{formatAuthors(paper.authors)}</p>}
                        {(paper.why || paper.reason || paper.abstract) && (
                          <p className="mt-2 text-sm leading-6 text-muted">
                            {truncate(paper.why || paper.reason || paper.abstract, 220)}
                          </p>
                        )}
                        {paper.prerequisites?.length > 0 && (
                          <p className="mt-2 text-xs text-muted">
                            <span className="font-semibold text-text">Prerequisites: </span>
                            {Array.isArray(paper.prerequisites) ? paper.prerequisites.join(', ') : paper.prerequisites}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <PaperDetailModal paper={openPaper} open={Boolean(openPaper)} onClose={() => setOpenPaper(null)} />
      </div>
    </PageTransition>
  )
}
