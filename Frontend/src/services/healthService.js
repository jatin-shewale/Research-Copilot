import axios from 'axios'

// /health and / live outside the /api/v1 prefix, so we use a bare axios call
// resolved relative to the current origin (works with the Vite dev proxy too).
export async function getBackendHealth() {
  const base = (import.meta.env.VITE_API_ROOT || '').replace(/\/$/, '')
  const { data } = await axios.get(`${base}/health`, { timeout: 8000 })
  return data
}

export default { getBackendHealth }
