const DEFAULTS = [
  'Summarize the key contributions across these papers',
  'What methods are most commonly used?',
  'What are the biggest open problems?',
  'How do these approaches compare to each other?',
]

export default function SuggestedQuestions({ onSelect, suggestions = DEFAULTS }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
