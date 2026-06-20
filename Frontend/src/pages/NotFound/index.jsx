import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-7xl font-extrabold gradient-text">404</p>
        <h1 className="mt-4 text-xl font-semibold text-text">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary mt-8">
          <FiArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </PageTransition>
  )
}
