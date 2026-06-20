import { useCallback, useState } from 'react'
import chatService from '../services/chatService'
import { useChatStore } from '../store/chatStore'

export function useChat(searchId) {
  const { getMessages, addMessage, setTyping, isTyping } = useChatStore()
  const [error, setError] = useState(null)
  const messages = getMessages(searchId)

  const sendMessage = useCallback(
    async (question) => {
      if (!searchId || !question.trim()) return
      setError(null)
      const userMessage = { role: 'user', content: question, ts: Date.now() }
      addMessage(searchId, userMessage)
      setTyping(true)
      try {
        const chatHistory = getMessages(searchId).map((m) => ({ role: m.role, content: m.content }))
        const response = await chatService.sendChatMessage({ searchId, question, chatHistory })
        addMessage(searchId, {
          role: 'assistant',
          content: response.answer,
          citations: response.citations || [],
          confidence: response.confidence,
          ts: Date.now(),
        })
      } catch (err) {
        setError(err.message || 'The research assistant could not respond.')
        addMessage(searchId, {
          role: 'assistant',
          content: "I couldn't reach the research backend just now. Please try again in a moment.",
          isError: true,
          ts: Date.now(),
        })
      } finally {
        setTyping(false)
      }
    },
    [addMessage, getMessages, searchId, setTyping]
  )

  return { messages, sendMessage, isTyping, error }
}

export default useChat
