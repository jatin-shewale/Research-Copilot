import { FiSearch, FiCpu, FiLayers, FiGitMerge } from 'react-icons/fi'
import FadeIn from '../../../components/animations/FadeIn'

const STEPS = [
  { icon: FiSearch, title: 'Ask a question', desc: 'Type any research topic — broad or specific — in plain language.' },
  { icon: FiCpu, title: 'Agents retrieve & read', desc: 'Specialized agents fetch papers from arXiv, rerank them, and extract methods & results.' },
  { icon: FiLayers, title: 'Synthesis & clustering', desc: 'Papers are clustered into themes, with trends, gaps and key contributors identified.' },
  { icon: FiGitMerge, title: 'Explore the map', desc: 'Navigate landscapes, knowledge graphs, reading paths, timelines — and chat with the results.' },
]

export default function HowItWorks() {
  return (
    <section className="bg-card py-24">
      <div className="container-page">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Research Workflow</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">How it works</h2>
        </FadeIn>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-primary/20 via-accent/30 to-secondary/20 lg:block" />
          {STEPS.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1} className="relative text-center">
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
                <s.icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-white text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
