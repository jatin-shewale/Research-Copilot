import { FiShare2, FiMap, FiCompass } from 'react-icons/fi'
import FadeIn from '../../../components/animations/FadeIn'

const PREVIEWS = [
  {
    icon: FiShare2,
    title: 'Knowledge Graph Preview',
    desc: 'Papers and clusters rendered as an interactive, zoomable graph with relationship edges.',
    accent: 'from-primary/15 to-secondary/10',
    nodes: 9,
  },
  {
    icon: FiMap,
    title: 'Reading Path Preview',
    desc: 'A guided sequence from foundational papers to frontier research, level by level.',
    accent: 'from-accent/15 to-primary/10',
    nodes: 6,
  },
  {
    icon: FiCompass,
    title: 'Research Landscape Preview',
    desc: 'Clusters, emerging trends, top authors and open problems, summarized at a glance.',
    accent: 'from-secondary/15 to-accent/10',
    nodes: 7,
  },
]

function MiniGraph({ nodes }) {
  const points = Array.from({ length: nodes }).map((_, i) => {
    const angle = (2 * Math.PI * i) / nodes
    return { x: 50 + 38 * Math.cos(angle), y: 50 + 38 * Math.sin(angle) }
  })
  return (
    <svg viewBox="0 0 100 100" className="h-40 w-full">
      {points.map((p, i) => (
        <line key={`l-${i}`} x1="50" y1="50" x2={p.x} y2={p.y} stroke="#C7CCFB" strokeWidth="0.6" />
      ))}
      <circle cx="50" cy="50" r="6" fill="#6366F1" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" fill={i % 2 === 0 ? '#A78BFA' : '#60A5FA'} />
      ))}
    </svg>
  )
}

export default function PreviewShowcase() {
  return (
    <section className="bg-card py-24">
      <div className="container-page">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Interactive Demo</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">See your research, visualized</h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PREVIEWS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08} className={`card-surface overflow-hidden bg-gradient-to-br ${p.accent} p-0`}>
              <div className="p-6 pb-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-card">
                  <p.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-text">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{p.desc}</p>
              </div>
              <div className="mt-4 bg-white/60 px-4 pb-4">
                <MiniGraph nodes={p.nodes} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
