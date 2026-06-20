import { motion } from 'framer-motion'
import CountUp from '../animations/CountUp'

export default function StatCard({ icon: Icon, label, value, suffix = '', tone = 'primary', delay = 0 }) {
  const tones = {
    primary: 'from-primary-50 to-white text-primary',
    accent: 'from-violet-50 to-white text-accent',
    secondary: 'from-blue-50 to-white text-secondary',
    success: 'from-emerald-50 to-white text-success',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="card-surface relative overflow-hidden p-5"
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tones[tone]} opacity-70`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-text">
            <CountUp value={value} />
            {suffix}
          </p>
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-card ${tones[tone].split(' ').pop()}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </motion.div>
  )
}
