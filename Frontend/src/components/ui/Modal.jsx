import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, widthClass = 'max-w-2xl' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`relative w-full ${widthClass} max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-lift`}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/90 backdrop-blur px-6 py-4">
              <h3 className="text-base font-semibold">{title}</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-text">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
