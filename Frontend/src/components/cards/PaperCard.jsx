import { motion } from 'framer-motion'
import { FiExternalLink, FiBookOpen, FiUsers } from 'react-icons/fi'
import Badge from '../ui/Badge'
import { formatAuthors, truncate, formatDate } from '../../utils/formatters'
import { arxivAbsUrl, arxivIdFromPaper } from '../../utils/arxiv'

export default function PaperCard({ paper, onOpen, rank }) {
  const arxivId = arxivIdFromPaper(paper)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="card-surface group flex h-full flex-col p-5 transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {typeof rank === 'number' && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-50 text-[11px] font-bold text-primary">
              {rank}
            </span>
          )}
          {paper.published_date && <Badge tone="default">{formatDate(paper.published_date)}</Badge>}
        </div>
        <a
          href={arxivAbsUrl(arxivId)}
          target="_blank"
          rel="noreferrer"
          className="text-muted transition-colors hover:text-primary"
          title="View on arXiv"
        >
          <FiExternalLink className="h-4 w-4" />
        </a>
      </div>

      <button onClick={() => onOpen?.(paper)} className="mt-3 text-left">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-text group-hover:text-primary">
          {paper.title}
        </h3>
      </button>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <FiUsers className="h-3.5 w-3.5 shrink-0" />
        <span className="line-clamp-1">{formatAuthors(paper.authors)}</span>
      </p>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted">{truncate(paper.abstract, 200)}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex flex-wrap gap-1.5">
          {paper.categories?.split(',').slice(0, 2).map((c) => (
            <Badge key={c} tone="primary">{c.trim()}</Badge>
          ))}
        </div>
        <button onClick={() => onOpen?.(paper)} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          <FiBookOpen className="h-3.5 w-3.5" /> Details
        </button>
      </div>
    </motion.div>
  )
}
