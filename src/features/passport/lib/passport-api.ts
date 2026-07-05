import axios from 'axios'

export interface PassportVerifiedTopic {
  name: string
  masteryPct: number
}

export interface PassportRoadmap {
  name: string
  topicsCount: number
  verifiedCount: number
  /** Every topic of this roadmap quiz-verified → earns a completion certificate. */
  isCompleted: boolean
}

/** Payload of GET /p/:shareToken — public, PII-free by contract (no email/ids). */
export interface PublicPassport {
  username: string
  level: string
  streak: number
  longestStreak: number
  verifiedTopics: PassportVerifiedTopic[]
  roadmaps: PassportRoadmap[]
  completedCount: number
  totalCount: number
}

/** Payload of GET/PATCH /me/passport (owner-only settings). */
export interface PassportSettings {
  shareToken: string | null
  isPublic: boolean
  publicUrl: string | null
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/client'

// Bare axios instance ON PURPOSE — not the shared apiClient: the passport page
// is public, so it must never attach a stored JWT, and an error here must not
// trigger the shared client's 401 → /login redirect for a logged-out visitor.
const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000,
})

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export const fetchPublicPassport = async (shareToken: string): Promise<PublicPassport> => {
  const res = await publicClient.get<ApiEnvelope<PublicPassport>>(`/p/${shareToken}`)
  return res.data.data
}

/** True only for the API's 404 (unknown token / owner turned sharing off) — a
 *  network error or 5xx (e.g. Render cold start) must NOT read as "not found". */
export const isPassportNotFoundError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404
