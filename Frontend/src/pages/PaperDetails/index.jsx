import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiDownload, FiExternalLink, FiUsers, FiCalendar } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import { SkeletonText } from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import Badge from '../../components/ui/Badge'
import { usePaper } from '../../hooks/usePapers'
import { formatAuthors, formatDate } from '../../utils/formatters'
import { arxivAbsUrl, arxivIdFromPaper, arxivPdfUrl } from '../../utils/arxiv'

const FIELDS = [
  ['problem', 'Problem'],
  ['motivation', 'Motivation'],
  ['method', 'Method'],
  ['architecture', 'Architecture'],
  ['datasets', 'Datasets'],
  ['evaluation', 'Evaluation'],
  ['results', 'Results'],
  ['contribution', 'Contributions'],
  ['limitations', 'Limitations'],
  ['future_work', 'Future Work'],
]

export default function PaperDetailsPage() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const { data: paper, isLoading, isError, error, refetch } = usePaper(paperId)

  return (
    <PageTransition>
      <div className="container-page py-10">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-3">
          <FiArrowLeft className="h-4 w-4" /> Back
        </button>

        {isLoading && (
          <div className="card-surface p-8">
            <SkeletonText lines={6} />
          </div>
        )}

        {isError && <ErrorState message={error?.message} onRetry={refetch} />}

        {paper && (
          <>
            <div className="card-surface p-8">
              <div className="flex flex-wrap items-center gap-2">
                {paper.published_date && (
                  <Badge icon={FiCalendar} tone="primary">{formatDate(paper.published_date)}</Badge>
                )}
                {paper.categories?.split(',').slice(0, 4).map((c) => <Badge key={c}>{c.trim()}</Badge>)}
              </div>

              <h1 className="mt-4 font-display text-2xl font-bold leading-snug text-text sm:text-3xl">{paper.title}</h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                <FiUsers className="h-4 w-4" /> {formatAuthors(paper.authors, 10)}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={arxivAbsUrl(arxivIdFromPaper(paper))} target="_blank" rel="noreferrer" className="btn-secondary">
                  <FiExternalLink className="h-4 w-4" /> View on arXiv
                </a>
                <a href={arxivPdfUrl(paper)} target="_blank" rel="noreferrer" className="btn-primary">
                  <FiDownload className="h-4 w-4" /> Download Paper
                </a>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Abstract</h3>
                <p className="mt-2 text-sm leading-7 text-text">{paper.abstract}</p>
              </div>
            </div>

            {FIELDS.some(([key]) => paper[key]) && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FIELDS.filter(([key]) => paper[key]).map(([key, label]) => (
                  <div key={key} className="card-surface p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-text">{paper[key]}</p>
                  </div>
                ))}
              </div>
            )}

            {paper.cluster_name && (
              <div className="card-surface mt-6 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Research Cluster</p>
                <p className="mt-1.5 text-sm font-medium text-text">{paper.cluster_name}</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  )
}
