import { useState } from 'react'
import { FiClock } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import NoActiveSearch from '../../components/search/NoActiveSearch'
import TimelineView from '../../components/timeline/TimelineView'
import EmptyState from '../../components/ui/EmptyState'
import PaperDetailModal from '../../components/papers/PaperDetailModal'
import { useSearchStore } from '../../store/searchStore'

export default function TimelinePage() {
  const { status, results, query } = useSearchStore()
  const [openPaper] = useState(null)

  if (status !== 'completed' || !results) {
    return (
      <PageTransition>
        <div className="container-page py-16">
          <NoActiveSearch description="The research timeline — tracing the field's evolution paper by paper — is generated once a research run finishes." />
        </div>
      </PageTransition>
    )
  }

  const papers = results.extracted_papers || results.reranked_papers || []

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Timeline"
          title={`Research evolution for “${results.query || query}”`}
          description="Papers ordered chronologically, highlighting how the field's ideas progressed."
        />

        <div className="mt-10">
          {papers.length > 0 ? (
            <TimelineView papers={papers} />
          ) : (
            <EmptyState icon={FiClock} title="No timeline data" description="This research run did not include dated papers." />
          )}
        </div>

        <PaperDetailModal paper={openPaper} open={Boolean(openPaper)} onClose={() => {}} />
      </div>
    </PageTransition>
  )
}
