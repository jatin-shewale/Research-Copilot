import { motion } from 'framer-motion'
import { FiCheck, FiLoader } from 'react-icons/fi'
import { PIPELINE_STAGES } from '../../constants'
import clsx from 'clsx'

export default function PipelineProgress({ activeStageIndex = 0, status = 'processing' }) {
  return (
    <div className="card-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-text">Live Research Pipeline</h3>
          <p className="text-sm text-muted">Multi-agent retrieval, extraction & synthesis in progress</p>
        </div>
        {status === 'processing' && <FiLoader className="h-5 w-5 animate-spin text-primary" />}
      </div>

      <div className="space-y-1">
        {PIPELINE_STAGES.map((stage, i) => {
          const isDone = i < activeStageIndex || status === 'completed'
          const isActive = i === activeStageIndex && status === 'processing'
          return (
            <div key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
              {i < PIPELINE_STAGES.length - 1 && (
                <span
                  className={clsx(
                    'absolute left-[15px] top-8 h-full w-0.5 transition-colors duration-500',
                    isDone ? 'bg-primary/40' : 'bg-border'
                  )}
                />
              )}
              <span
                className={clsx(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isDone && 'border-primary bg-primary text-white',
                  isActive && 'border-primary bg-white text-primary',
                  !isDone && !isActive && 'border-border bg-white text-muted'
                )}
              >
                {isDone ? (
                  <FiCheck className="h-4 w-4" />
                ) : isActive ? (
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                  />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-border" />
                )}
              </span>
              <div className="pt-1">
                <p className={clsx('text-sm font-semibold', isDone || isActive ? 'text-text' : 'text-muted')}>{stage.label}</p>
                <p className="mt-0.5 text-xs text-muted">{stage.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
