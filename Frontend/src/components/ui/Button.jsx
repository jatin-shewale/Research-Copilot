import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

export default function Button({ as: As = 'button', variant = 'primary', className, children, icon: Icon, iconRight: IconRight, ...props }) {
  return (
    <motion.span whileTap={{ scale: 0.97 }} className="inline-block">
      <As className={clsx(variants[variant], className)} {...props}>
        {Icon && <Icon className="h-4 w-4" />}
        {children}
        {IconRight && <IconRight className="h-4 w-4" />}
      </As>
    </motion.span>
  )
}
