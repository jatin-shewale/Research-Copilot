import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { formatAuthors, formatDate } from '../../utils/formatters'
import { arxivAbsUrl, arxivIdFromPaper, arxivPdfUrl } from '../../utils/arxiv'
import { FiDownload, FiExternalLink } from 'react-icons/fi'

const FIELDS = [
  ['problem', 'Problem'],
  ['motivation', 'Motivation'],
  ['method', 'Method'],
  ['architecture', 'Architecture'],
  ['datasets', 'Datasets'],
  ['evaluation', 'Evaluation'],
  ['results', 'Results'],
  ['contribution', 'Contribution'],
  ['limitations', 'Limitations'],
  ['future_work', 'Future Work'],
]

export default function PaperDetailModal({ paper, open, onClose }) {
  if (!paper) return null
  const arxivId = arxivIdFromPaper(paper)
  return (
    <Modal open={open} onClose={onClose} title="Paper Details" widthClass="max-w-3xl">
      <h2 className="font-display text-xl font-bold text-text">{paper.title}</h2>
      <p className="mt-1.5 text-sm text-muted">{formatAuthors(paper.authors, 8)}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {paper.published_date && <Badge tone="primary">{formatDate(paper.published_date)}</Badge>}
        {paper.categories?.split(',').slice(0, 3).map((c) => <Badge key={c}>{c.trim()}</Badge>)}
      </div>

      <p className="mt-4 text-sm leading-6 text-text">{paper.abstract}</p>

      <div className="mt-5 flex gap-3">
        <a href={arxivAbsUrl(arxivId)} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
          <FiExternalLink className="h-3.5 w-3.5" /> View on arXiv
        </a>
        <a href={arxivPdfUrl(paper)} target="_blank" rel="noreferrer" className="btn-primary text-xs">
          <FiDownload className="h-3.5 w-3.5" /> Download PDF
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.filter(([key]) => paper[key]).map(([key, label]) => (
          <div key={key} className="rounded-xl border border-border bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</p>
            <p className="mt-1.5 text-sm leading-6 text-text">{paper[key]}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}
