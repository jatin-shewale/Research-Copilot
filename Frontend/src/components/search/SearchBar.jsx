import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight } from 'react-icons/fi'
import { SEARCH_SUGGESTIONS } from '../../constants'

export default function SearchBar({ onSearch, loading, initialValue = '', size = 'lg' }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !loading) onSearch(value.trim())
  }

  const isLg = size === 'lg'

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <FiSearch className={`pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted ${isLg ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask about a research topic — e.g. “How do diffusion models compare to GANs?”"
          className={`input-field shadow-card ${isLg ? 'h-14 pl-12 pr-32 text-base rounded-2xl' : 'h-11 pl-10 pr-24'}`}
          disabled={loading}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          disabled={loading || !value.trim()}
          className={`btn-primary absolute right-2 top-1/2 -translate-y-1/2 ${isLg ? 'h-10 px-5' : 'h-8 px-3.5 text-xs'}`}
        >
          {loading ? 'Researching…' : 'Research'}
          {!loading && <FiArrowRight className="h-4 w-4" />}
        </motion.button>
      </form>

      {isLg && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-muted">Try:</span>
          {SEARCH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => !loading && onSearch(s)}
              disabled={loading}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
