import { motion } from 'framer-motion'
import { FiLayers, FiChevronDown } from 'react-icons/fi'
import { useState } from 'react'
import clsx from 'clsx'
import Badge from '../ui/Badge'

const PALETTE = ['#6366F1', '#A78BFA', '#60A5FA', '#22C55E', '#F59E0B', '#EF4444', '#0EA5E9', '#EC4899']

export default function ClusterCard({ cluster, index = 0 }) {
  const [open, setOpen] = useState(false)
  const color = PALETTE[index % PALETTE.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-surface overflow-hidden p-0"
    >
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1A`, color }}
          >
            <FiLayers className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-[15px] font-semibold text-text">{cluster.name}</h3>
            <p className="text-xs text-muted">{cluster.paper_count} paper{cluster.paper_count === 1 ? '' : 's'}</p>
          </div>
        </div>
        <FiChevronDown className={clsx('h-4 w-4 shrink-0 text-muted transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden border-t border-border"
      >
        <ul className="divide-y divide-border">
          {(cluster.papers || []).slice(0, 8).map((p, i) => (
            <li key={p.arxiv_id || p.title || i} className="px-5 py-3">
              <p className="line-clamp-1 text-sm font-medium text-text">{p.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted">{Array.isArray(p.authors) ? p.authors.slice(0, 2).join(', ') : ''}</p>
            </li>
          ))}
          {cluster.papers?.length > 8 && (
            <li className="px-5 py-2.5">
              <Badge>+{cluster.papers.length - 8} more papers</Badge>
            </li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  )
}
