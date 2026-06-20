export default function ListItemCard({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text">{title}</p>
          {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}
