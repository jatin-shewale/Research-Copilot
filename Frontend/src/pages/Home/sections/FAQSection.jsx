import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import clsx from 'clsx'
import FadeIn from '../../../components/animations/FadeIn'

const FAQS = [
  { q: 'Where do papers come from?', a: 'Research Copilot retrieves papers directly from arXiv based on agent-generated search queries derived from your question.' },
  { q: 'Do I need to create an account?', a: 'No. There is no login or signup — every session runs against a shared guest workspace so you can start researching immediately.' },
  { q: 'How long does a research run take?', a: 'Most queries complete within one to a few minutes, depending on how many papers are retrieved, extracted and synthesized.' },
  { q: 'Can I ask follow-up questions?', a: 'Yes — the Research Chat page lets you ask grounded, cited follow-up questions about any completed research session.' },
  { q: 'What models power the pipeline?', a: 'Extraction and synthesis are powered by a local Qwen3 model served via Ollama, with embeddings used for reranking and clustering.' },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="card-surface overflow-hidden p-0">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="text-sm font-semibold text-text">{item.q}</span>
        <FiChevronDown className={clsx('h-4 w-4 shrink-0 text-muted transition-transform duration-300', isOpen && 'rotate-180 text-primary')} />
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-6 text-muted">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section className="container-page py-24">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl">Frequently asked questions</h2>
      </FadeIn>

      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {FAQS.map((item, i) => (
          <FAQItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </section>
  )
}
