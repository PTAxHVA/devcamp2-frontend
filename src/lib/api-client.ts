import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/client'

/**
 * Shared axios instance.
 * JWT token (if present in localStorage) is auto-attached.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Hosted backend (Render free tier) sleeps after ~15 min; the first request
  // after a cold start can take ~50s. Give requests room before timing out.
  timeout: 60_000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * On 401 the stored token is missing/expired. Clear auth and bounce to login
 * so the app doesn't sit looping unauthorized requests behind a stale token.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)
