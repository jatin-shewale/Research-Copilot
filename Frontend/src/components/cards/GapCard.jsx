import { motion } from 'framer-motion'
import { FiCompass } from 'react-icons/fi'
import Badge from '../ui/Badge'
import { pct } from '../../utils/formatters'

const TYPE_TONE = {
  underexplored_combination: 'accent',
  unresolved_problem: 'warning',
  data_insufficient: 'default',
}

export default function GapCard({ gap, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card-surface flex gap-4 p-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-warning">
        <FiCompass className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={TYPE_TONE[gap.type] || 'default'}>{(gap.type || 'gap').replace(/_/g, ' ')}</Badge>
          <Badge tone="default">{pct(gap.confidence)} confidence</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-text">{gap.description}</p>
        {gap.supporting_papers?.length > 0 && (
          <p className="mt-2 line-clamp-1 text-xs text-muted">Related: {gap.supporting_papers.slice(0, 3).join(' · ')}</p>
        )}
      </div>
    </motion.div>
  )
}
