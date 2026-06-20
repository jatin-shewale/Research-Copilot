import { FiFileText } from 'react-icons/fi'

export default function CitationList({ citations }) {
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Sources</p>
      <div className="flex flex-wrap gap-1.5">
        {citations.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-slate-50 px-2.5 py-1 text-[11px] text-muted">
            <FiFileText className="h-3 w-3" />
            {typeof c === 'string' ? c : c.title || c.arxiv_id || `Source ${i + 1}`}
          </span>
        ))}
      </div>
    </div>
  )
}
