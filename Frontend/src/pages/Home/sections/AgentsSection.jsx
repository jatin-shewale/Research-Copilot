import { FiCompass, FiDownload, FiSliders, FiFileText, FiShare2, FiMap, FiAlertCircle, FiMessageCircle } from 'react-icons/fi'
import FadeIn from '../../../components/animations/FadeIn'

const AGENTS = [
  { icon: FiCompass, name: 'Query Understanding Agent', role: 'Decomposes your question into precise search strategies.' },
  { icon: FiDownload, name: 'Paper Retrieval Agent', role: 'Queries arXiv for the most relevant candidate papers.' },
  { icon: FiSliders, name: 'Semantic Reranking Agent', role: 'Reorders results by true relevance, not keyword overlap.' },
  { icon: FiFileText, name: 'Paper Extraction Agent', role: 'Pulls structured methods, results & contributions from each paper.' },
  { icon: FiShare2, name: 'Knowledge Graph Generator', role: 'Builds the paper-cluster relationship graph for visualization.' },
  { icon: FiMap, name: 'Reading Path Agent', role: 'Sequences papers into a beginner-to-researcher learning journey.' },
  { icon: FiAlertCircle, name: 'Research Gap Detector', role: 'Flags underexplored areas and unresolved problems.' },
  { icon: FiMessageCircle, name: 'Research Chat Agent', role: 'Answers follow-up questions, grounded in retrieved papers.' },
]

export default function AgentsSection() {
  return (
    <section className="container-page py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Under the Hood</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">A team of specialized AI agents</h2>
        <p className="mt-4 text-muted">Each stage of the pipeline is handled by a focused agent, chained together into one coherent research run.</p>
      </FadeIn>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((a, i) => (
          <FadeIn key={a.name} delay={i * 0.04} className="card-surface flex items-start gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-primary">
              <a.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-text">{a.name}</h4>
              <p className="mt-1 text-xs leading-5 text-muted">{a.role}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
