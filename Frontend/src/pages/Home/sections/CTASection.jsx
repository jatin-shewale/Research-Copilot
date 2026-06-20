import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function CTASection() {
  const navigate = useNavigate()
  return (
    <section className="container-page pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-600 to-accent px-8 py-16 text-center shadow-glow sm:px-16"
      >
        <div className="absolute inset-0 bg-grid-slate bg-[size:36px_36px] opacity-10 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]" />
        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
          Start mapping a research field today
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
          No setup, no signup — just ask a question and watch the pipeline retrieve, read, and synthesize the literature for you.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lift transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Launch Research Copilot <FiArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </section>
  )
}
