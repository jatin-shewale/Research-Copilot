import clsx from 'clsx'
import { motion } from 'framer-motion'

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={clsx('flex items-center gap-1 rounded-xl bg-slate-100 p-1', className)}>
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              'relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
              isActive ? 'text-primary' : 'text-muted hover:text-text'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-card"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
