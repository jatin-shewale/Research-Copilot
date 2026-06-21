import { motion } from 'framer-motion'
import { FiArrowRight, FiPlay } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SearchBar from '../../../components/search/SearchBar'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '../../../store/searchStore'
import useResearchPipeline from '../../../hooks/useResearchPipeline'

const FLOATING_NODES = [
  { x: '8%', y: '20%', delay: 0, size: 10, color: '#6366F1' },
  { x: '88%', y: '16%', delay: 0.4, size: 8, color: '#A78BFA' },
  { x: '14%', y: '78%', delay: 0.8, size: 12, color: '#60A5FA' },
  { x: '92%', y: '70%', delay: 1.2, size: 9, color: '#22C55E' },
  { x: '50%', y: '8%', delay: 0.2, size: 7, color: '#F59E0B' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const { run } = useResearchPipeline()

  const handleSearch = (query) => {
    run(query)
  }

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid-slate bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />

      {FLOATING_NODES.map((n, i) => (
        <motion.span
          key={i}
          className="absolute hidden rounded-full opacity-50 blur-[1px] lg:block"
          style={{ left: n.x, top: n.y, width: n.size, height: n.size, backgroundColor: n.color }}
          animate={{ y: [0, -16, 0] }}
          transition={{ repeat: Infinity, duration: 5 + i, delay: n.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="container-page relative py-24 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted shadow-card"
          >
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
            Multi-agent research pipeline
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-text sm:text-6xl"
          >
            Turn any research question into a{' '}
            <span className="gradient-text">navigable map</span> of the literature.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg"
          >
            Research Copilot retrieves, reads, clusters and explains scientific papers — generating
            knowledge graphs, reading paths and gap analyses from a single query.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-10 max-w-5xl"
          >
            <SearchBar onSearch={handleSearch} size="lg" className="mx-auto max-w-5xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/dashboard" className="btn-secondary">
              Explore Dashboard <FiArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => navigate('/search')} className="btn-ghost">
              <FiPlay className="h-4 w-4" /> See it in action
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
