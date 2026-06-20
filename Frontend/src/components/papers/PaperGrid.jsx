import { motion } from 'framer-motion'
import PaperCard from '../cards/PaperCard'

export default function PaperGrid({ papers = [], onOpen, ranked = false }) {
  return (
    <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {papers.map((paper, i) => (
        <PaperCard key={paper.arxiv_id || paper.id || i} paper={paper} onOpen={onOpen} rank={ranked ? i + 1 : undefined} />
      ))}
    </motion.div>
  )
}
