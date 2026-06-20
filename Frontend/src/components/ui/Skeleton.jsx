import clsx from 'clsx'

export default function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }) {
  return (
    <div className={clsx('card-surface p-6 space-y-4', className)}>
      <Skeleton className="h-5 w-1/3" />
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}
