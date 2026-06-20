import clsx from 'clsx'

export default function Spinner({ size = 20, className }) {
  return (
    <span
      className={clsx('inline-block animate-spin rounded-full border-[2.5px] border-primary/20 border-t-primary', className)}
      style={{ width: size, height: size }}
    />
  )
}
