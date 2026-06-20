import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiUser, FiCpu, FiAlertCircle } from 'react-icons/fi'
import clsx from 'clsx'
import CitationList from './CitationList'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex w-full gap-3', isUser && 'flex-row-reverse')}
    >
      <span
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-white' : message.isError ? 'bg-rose-50 text-danger' : 'bg-gradient-to-br from-primary to-accent text-white'
        )}
      >
        {isUser ? <FiUser className="h-4 w-4" /> : message.isError ? <FiAlertCircle className="h-4 w-4" /> : <FiCpu className="h-4 w-4" />}
      </span>

      <div className={clsx('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6', isUser ? 'bg-primary text-white' : 'card-surface text-text')}>
        <div className={clsx('prose prose-sm max-w-none', isUser && 'prose-invert')}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        {!isUser && message.citations?.length > 0 && <CitationList citations={message.citations} />}
        {!isUser && typeof message.confidence === 'number' && (
          <p className="mt-2 text-[11px] font-medium text-muted">Confidence: {Math.round(message.confidence * 100)}%</p>
        )}
      </div>
    </motion.div>
  )
}
