import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function StaggerGroup({ children, className }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
