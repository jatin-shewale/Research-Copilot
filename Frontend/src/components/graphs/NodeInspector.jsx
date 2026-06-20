import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiExternalLink, FiUsers, FiLayers } from 'react-icons/fi'
import { formatAuthors, truncate } from '../../utils/formatters'
import { arxivAbsUrl } from '../../utils/arxiv'

export default function NodeInspector({ node, onClose }) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute right-3 top-3 bottom-3 z-10 w-[300px] overflow-y-auto rounded-2xl border border-border bg-white/95 backdrop-blur p-5 shadow-lift"
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                node.type === 'cluster' ? 'bg-violet-50 text-accent' : 'bg-primary-50 text-primary'
              }`}
            >
              <FiLayers className="h-4 w-4" />
            </span>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-slate-100">
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-3 text-sm font-semibold leading-snug text-text">{node.data?.label}</h3>

          {node.type === 'cluster' ? (
            <p className="mt-2 text-xs text-muted">{node.data?.paper_count} papers in this research theme.</p>
          ) : (
            <>
              {node.data?.authors?.length > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <FiUsers className="h-3.5 w-3.5" /> {formatAuthors(node.data.authors)}
                </p>
              )}
              {node.data?.abstract && (
                <p className="mt-3 text-xs leading-5 text-muted">{truncate(node.data.abstract, 320)}</p>
              )}
              {node.data?.arxiv_id && (
                <a
                  href={arxivAbsUrl(node.data.arxiv_id)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-4 w-full text-xs"
                >
                  View on arXiv <FiExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
