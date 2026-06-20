import clsx from 'clsx'
import { motion } from 'framer-motion'

export default function Card({ className, children, hover = false, as = 'div', ...props }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={clsx('card-surface p-6', hover && 'transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
