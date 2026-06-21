import { Link } from 'react-router-dom'
import { FiActivity, FiGithub, FiTwitter } from 'react-icons/fi'
import { APP_NAME, NAV_LINKS } from '../../constants'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <FiActivity className="h-4 w-4" />
              </span>
              <span className="font-display text-[15px] font-bold text-text">{APP_NAME}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              An AI research copilot that retrieves, reads, clusters and explains scientific literature —
              turning a single query into a navigable map of an entire research field.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-lg border border-border p-2 text-muted hover:text-primary hover:border-primary/40">
                <FiGithub className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-lg border border-border p-2 text-muted hover:text-primary hover:border-primary/40">
                <FiTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text">Platform</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.slice(0, 5).map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-muted hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text">Resources</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="https://arxiv.org" target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-primary">arXiv.org</a></li>
              <li><Link to="/dashboard" className="text-sm text-muted hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} {APP_NAME}. Built for researchers, by researchers.</p>
          <p className="text-xs text-muted">Powered by arXiv · Qwen3 · ChromaDB</p>
        </div>
      </div>
    </footer>
  )
}
