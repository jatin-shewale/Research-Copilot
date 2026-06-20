import { FiSearch } from 'react-icons/fi'

export default function PaperSearchInput({ value, onChange, placeholder = 'Search papers by title or abstract…' }) {
  return (
    <div className="relative max-w-md flex-1">
      <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field pl-10" />
    </div>
  )
}
