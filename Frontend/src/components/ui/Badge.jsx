import clsx from 'clsx'

const tones = {
  default: 'bg-slate-50 text-muted border-border',
  primary: 'bg-primary-50 text-primary-700 border-primary-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  accent: 'bg-violet-50 text-violet-700 border-violet-100',
}

export default function Badge({ children, tone = 'default', className, icon: Icon }) {
  return (
    <span className={clsx('badge', tones[tone], className)}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}
