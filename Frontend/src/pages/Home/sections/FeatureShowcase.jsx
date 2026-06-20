import { FiSearch, FiLayers, FiShare2, FiMap, FiClock, FiMessageSquare, FiCompass, FiZap } from 'react-icons/fi'
import { StaggerGroup, StaggerItem } from '../../../components/animations/StaggerGroup'
import FadeIn from '../../../components/animations/FadeIn'

const FEATURES = [
  { icon: FiSearch, title: 'Intelligent Retrieval', desc: 'Understands intent, expands your query, and pulls the most relevant papers directly from arXiv.' },
  { icon: FiZap, title: 'Semantic Reranking', desc: 'Re-scores candidates with embedding similarity so the strongest matches surface first.' },
  { icon: FiLayers, title: 'Research Clustering', desc: 'Groups papers into named themes using embeddings and HDBSCAN — no manual tagging.' },
  { icon: FiShare2, title: 'Knowledge Graphs', desc: 'Visualizes papers, clusters and relationships as an explorable, interactive graph.' },
  { icon: FiMap, title: 'Guided Reading Paths', desc: 'Beginner-to-researcher learning journeys sequenced for how concepts actually build on each other.' },
  { icon: FiClock, title: 'Research Timelines', desc: 'See how a field evolved — from foundational papers to the latest frontier work.' },
  { icon: FiCompass, title: 'Gap Detection', desc: 'Surfaces underexplored combinations and open problems worth pursuing next.' },
  { icon: FiMessageSquare, title: 'Research Chat', desc: 'Ask follow-up questions and get cited, grounded answers from the papers you retrieved.' },
]

export default function FeatureShowcase() {
  return (
    <section className="container-page py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Capabilities</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">Everything you need to explore a field</h2>
        <p className="mt-4 text-muted">A complete multi-agent research pipeline, from raw query to structured understanding.</p>
      </FadeIn>

      <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <StaggerItem key={f.title}>
            <div className="card-surface group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{f.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
