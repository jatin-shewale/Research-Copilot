import api from './api'

export async function sendChatMessage({ searchId, question, chatHistory = [] }) {
  const { data } = await api.post('/chat/', {
    search_id: searchId,
    question,
    chat_history: chatHistory,
  })
  return data // { answer, citations, confidence }
}

export default { sendChatMessage }
