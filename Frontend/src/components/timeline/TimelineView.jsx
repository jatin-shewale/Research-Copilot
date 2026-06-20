import { motion } from 'framer-motion'
import { FiFileText } from 'react-icons/fi'
import { formatDate, formatAuthors, truncate } from '../../utils/formatters'
import Badge from '../ui/Badge'

export default function TimelineView({ papers = [] }) {
  const sorted = [...papers]
    .filter((p) => p.published_date)
    .sort((a, b) => new Date(a.published_date) - new Date(b.published_date))

  if (sorted.length === 0) return null

  return (
    <div className="relative pl-8">
      <span className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary opacity-30" />
      <div className="space-y-8">
        {sorted.map((paper, i) => (
          <motion.div
            key={paper.arxiv_id || paper.id || i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="relative"
          >
            <span className="absolute -left-8 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background bg-primary shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <div className="card-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="primary">{formatDate(paper.published_date)}</Badge>
                {i === 0 && <Badge tone="success">Earliest</Badge>}
                {i === sorted.length - 1 && <Badge tone="accent">Most Recent</Badge>}
              </div>
              <h3 className="mt-2.5 flex items-start gap-2 font-display text-[15px] font-semibold text-text">
                <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {paper.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{formatAuthors(paper.authors)}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{truncate(paper.abstract, 180)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
