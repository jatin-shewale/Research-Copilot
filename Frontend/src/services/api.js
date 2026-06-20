import axios from 'axios'
import { API_BASE_URL } from '../constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor — attaches a bearer token if present.
// The backend gracefully falls back to a shared "guest" account when no
// token is supplied, so the app works fully without any login screen.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rc_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — normalizes errors into a predictable shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const detail =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong while talking to the Research Copilot backend.'

    const normalized = {
      status: status || 0,
      message: Array.isArray(detail) ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ') : detail,
      isNetworkError: !error?.response,
    }

    return Promise.reject(normalized)
  }
)

export default api
