import { motion } from 'framer-motion'

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </motion.div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  )
}
