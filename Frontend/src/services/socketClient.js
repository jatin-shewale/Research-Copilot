import { io } from 'socket.io-client'

/**
 * Optional realtime client.
 *
 * NOTE: The current backend (FastAPI) does not yet expose a Socket.IO
 * endpoint — search progress is retrieved by polling GET /search/{id}
 * (see hooks/useResearchPipeline.js). This client is wired up and ready
 * to go for when a websocket gateway is added server-side; it stays
 * fully inert (never connects) unless VITE_ENABLE_WEBSOCKET=true.
 */
let socket = null

export function getSocket() {
  const enabled = import.meta.env.VITE_ENABLE_WEBSOCKET === 'true'
  if (!enabled) return null

  if (!socket) {
    const url = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_ROOT || '/'
    socket = io(url, { autoConnect: false, transports: ['websocket'] })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (s && !s.connected) s.connect()
  return s
}

export function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect()
}

export default { getSocket, connectSocket, disconnectSocket }
