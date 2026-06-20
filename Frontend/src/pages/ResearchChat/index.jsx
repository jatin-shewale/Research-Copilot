import { useEffect, useRef } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import PageTransition from '../../components/layout/PageTransition'
import PageHeader from '../../components/layout/PageHeader'
import NoActiveSearch from '../../components/search/NoActiveSearch'
import MessageBubble from '../../components/chat/MessageBubble'
import TypingIndicator from '../../components/chat/TypingIndicator'
import SuggestedQuestions from '../../components/chat/SuggestedQuestions'
import ChatInput from '../../components/chat/ChatInput'
import { useSearchStore } from '../../store/searchStore'
import { useChat } from '../../hooks/useChat'

export default function ResearchChatPage() {
  const { status, results, query, searchId } = useSearchStore()
  const { messages, sendMessage, isTyping } = useChat(searchId)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  if (status !== 'completed' || !results) {
    return (
      <PageTransition>
        <div className="container-page py-16">
          <NoActiveSearch
            title="No active research session to chat about"
            description="Run a research query first — then come back here to ask grounded, cited follow-up questions about the papers retrieved."
          />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container-page py-10">
        <PageHeader
          eyebrow="Research Chat"
          title="Ask about your research"
          description={`Grounded in “${results.query || query}” — ${results.extracted_papers?.length || 0} papers in context.`}
        />

        <div className="card-surface mt-8 flex h-[640px] flex-col overflow-hidden p-0">
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                  <FiMessageSquare className="h-5 w-5" />
                </span>
                <p className="mt-4 max-w-sm text-sm text-muted">
                  Ask a question grounded in the papers from this research run. Try one of the suggestions below to get started.
                </p>
                <div className="mt-5">
                  <SuggestedQuestions onSelect={sendMessage} />
                </div>
              </div>
            )}
            {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
            {isTyping && <TypingIndicator />}
          </div>
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </PageTransition>
  )
}
