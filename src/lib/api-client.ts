import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

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

const COLD_START_TOAST_ID = 'server-waking'
const MAX_COLD_START_RETRIES = 2
const RETRY_BASE_DELAY_MS = 2000
// Only idempotent methods are auto-retried — replaying a POST/PATCH/etc. on an
// ambiguous failure could double-submit (e.g. enroll, quiz answer).
const RETRIABLE_METHODS = ['get', 'head', 'options']

type RetriableConfig = InternalAxiosRequestConfig & { _coldStartRetry?: number }

/**
 * A cold start (Render free tier spinning up after idle) shows up as either a
 * network/timeout error (no response) or a 502/503/504 from the edge while the
 * server boots.
 */
const isColdStartError = (error: AxiosError): boolean =>
  !error.response || [502, 503, 504].includes(error.response.status)

/**
 * Response interceptor:
 * - 401 → the stored token is missing/expired. Clear auth and bounce to login so
 *   the app doesn't sit looping unauthorized requests behind a stale token.
 * - cold start → surface a "server waking up" toast and retry a couple of times
 *   with backoff, so the first request after the backend sleeps doesn't look like
 *   a silent network/CORS failure.
 */
apiClient.interceptors.response.use(
  (response) => {
    toast.dismiss(COLD_START_TOAST_ID)
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined

    // Cold start on a safe-to-replay request → waking-up toast + retry with backoff.
    if (
      config &&
      isColdStartError(error) &&
      RETRIABLE_METHODS.includes((config.method ?? 'get').toLowerCase())
    ) {
      const attempt = config._coldStartRetry ?? 0
      if (attempt < MAX_COLD_START_RETRIES) {
        config._coldStartRetry = attempt + 1
        toast.loading('Server is starting up — retrying…', { id: COLD_START_TOAST_ID })
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY_MS * (attempt + 1)))
        return apiClient.request(config)
      }
    }

    // Terminal outcome — clear the waking-up toast so it can never linger.
    toast.dismiss(COLD_START_TOAST_ID)

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    } else if (isColdStartError(error)) {
      // Cold start we couldn't auto-recover (non-idempotent, or retries exhausted).
      toast.error('Server is taking longer than usual. Please try again.')
    }

    return Promise.reject(error)
  },
)
