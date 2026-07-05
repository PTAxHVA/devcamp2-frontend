/** One curated topic inside a gap group (mirrors the BE job-readiness DTO). */
export interface GapTopicItem {
  topicId: string
  name: string
  estimatedHours: number
}

/** Response of POST /ai/job-readiness. */
export interface JobReadinessResult {
  role: string
  readinessPct: number
  /** 'fallback' = Gemini was down/invalid — BE served the curated role checklist. */
  source: 'ai' | 'fallback'
  verified: GapTopicItem[]
  inProgress: GapTopicItem[]
  missing: GapTopicItem[]
  /** Only present when the onboarding questionnaire captured hours-per-week. */
  etaWeeks?: number
}
