import { FiSun, FiMoon, FiActivity, FiDatabase, FiCpu, FiServer, FiZap, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { useBackendHealth } from '../../hooks/useBackendHealth'
import { useSettingsStore } from '../../store/settingsStore'
import clsx from 'clsx'

function StatusRow({ icon: Icon, label, healthy, detail }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-4 last:border-0">
      <div className="flex items-center gap-3">
        <span className={clsx('flex h-9 w-9 items-center justify-center rounded-lg', healthy ? 'bg-emerald-50 text-success' : 'bg-rose-50 text-danger')}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-text">{label}</p>
          {detail && <p className="text-xs text-muted">{detail}</p>}
        </div>
      </div>
      {healthy ? <FiCheckCircle className="h-5 w-5 text-success" /> : <FiXCircle className="h-5 w-5 text-danger" />}
    </div>
  )
}

export default function SettingsPage() {
  const { data, isLoading, isError } = useBackendHealth()
  const { theme, denseMode, animationsEnabled, updateSettings } = useSettingsStore()

  const overallHealthy = !isError && data?.status === 'healthy'

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader eyebrow="Configuration" title="Settings" description="Theme preferences, model information, and live backend status." />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card-surface p-6">
            <h3 className="font-display text-base font-semibold text-text">Theme Preferences</h3>
            <p className="text-sm text-muted">Research Copilot uses a soft, light interface by default.</p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={clsx('flex flex-1 items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors', theme === 'light' ? 'border-primary bg-primary-50 text-primary' : 'border-border text-muted hover:bg-slate-50')}
              >
                <FiSun className="h-4 w-4" /> Light
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                disabled
                title="Dark theme coming soon"
                className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border p-4 text-sm font-medium text-muted/50"
              >
                <FiMoon className="h-4 w-4" /> Dark (soon)
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-text">Animations</p>
                <p className="text-xs text-muted">Enable Framer Motion micro-interactions across the app</p>
              </div>
              <button
                onClick={() => updateSettings({ animationsEnabled: !animationsEnabled })}
                className={clsx('relative h-6 w-11 rounded-full transition-colors', animationsEnabled ? 'bg-primary' : 'bg-slate-200')}
              >
                <span className={clsx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', animationsEnabled ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-text">Dense Mode</p>
                <p className="text-xs text-muted">Reduce spacing for higher information density</p>
              </div>
              <button
                onClick={() => updateSettings({ denseMode: !denseMode })}
                className={clsx('relative h-6 w-11 rounded-full transition-colors', denseMode ? 'bg-primary' : 'bg-slate-200')}
              >
                <span className={clsx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', denseMode ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
            </div>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-text">System Health</h3>
              {isLoading ? <Spinner size={16} /> : <Badge tone={overallHealthy ? 'success' : 'danger'}>{overallHealthy ? 'All systems operational' : 'Degraded / Offline'}</Badge>}
            </div>
            <p className="text-sm text-muted">Live status pulled from the backend `/health` endpoint.</p>

            <div className="mt-2">
              <StatusRow icon={FiServer} label="Backend API" healthy={overallHealthy} detail={isError ? 'Could not reach backend' : data?.status || 'Unknown'} />
              <StatusRow icon={FiDatabase} label="Vector Database (ChromaDB)" healthy={overallHealthy} detail="Embeddings & semantic search index" />
              <StatusRow icon={FiCpu} label="Ollama Runtime" healthy={overallHealthy} detail="Local LLM serving" />
              <StatusRow icon={FiZap} label="Qwen3 Model" healthy={overallHealthy} detail="Extraction, synthesis & chat" />
            </div>
          </div>
        </div>

        <div className="card-surface mt-6 p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-text">
            <FiActivity className="h-4 w-4 text-primary" /> Model Information
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">LLM</p>
              <p className="mt-1 text-sm font-medium text-text">Qwen3 (via Ollama)</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Vector Store</p>
              <p className="mt-1 text-sm font-medium text-text">ChromaDB</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Paper Source</p>
              <p className="mt-1 text-sm font-medium text-text">arXiv.org</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
