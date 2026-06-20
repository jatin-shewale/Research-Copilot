export function formatDate(dateString) {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export function timeAgo(dateString) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  const ranges = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, secs] of ranges) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${unit}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export function truncate(text, max = 220) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trim()}…` : text
}

export function formatAuthors(authors, max = 3) {
  if (!authors) return 'Unknown authors'
  const names = Array.isArray(authors)
    ? authors.map((a) => (typeof a === 'string' ? a : a?.name)).filter(Boolean)
    : []
  if (names.length === 0) return 'Unknown authors'
  if (names.length <= max) return names.join(', ')
  return `${names.slice(0, max).join(', ')} +${names.length - max} more`
}

export function formatNumber(n) {
  if (n === null || n === undefined) return '0'
  return new Intl.NumberFormat('en-US').format(n)
}

export function pct(n) {
  if (n === null || n === undefined) return '—'
  return `${Math.round(n * 100)}%`
}
