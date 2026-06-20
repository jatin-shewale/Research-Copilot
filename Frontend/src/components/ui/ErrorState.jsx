import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import Button from './Button'

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-danger shadow-card">
        <FiAlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>}
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry} icon={FiRefreshCw}>
          Try again
        </Button>
      )}
    </div>
  )
}
