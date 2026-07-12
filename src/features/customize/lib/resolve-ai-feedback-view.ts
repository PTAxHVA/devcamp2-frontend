export type AiFeedbackSeverity = 'info' | 'warning'
export type AiFeedbackSource = 'ai' | 'fallback'

/** The roadmap-edit AI feedback payload (POST /ai/roadmap-feedback). */
export interface AiFeedbackData {
  feedback: string
  severity: AiFeedbackSeverity
  /** Tags whether this is a real AI note or a degraded fallback. Absent on an
   *  older backend that has not shipped the `source` field yet. */
  source?: AiFeedbackSource
}

export interface AiFeedbackViewState {
  pending: boolean
  error: boolean
  feedback: AiFeedbackData | null
}

export interface AiFeedbackView {
  message: string
  tone: AiFeedbackSeverity
  /** Secondary line explaining a degraded/failed response; absent on a normal AI note. */
  note?: string
}

const IDLE_MESSAGE = 'Add or remove a topic and the AI will tell you how it affects your path.'

/**
 * Decide what the editor's AI-feedback card shows. Pure so the degrade/error
 * behaviour is unit-tested without rendering the editor:
 * - pending           → a "reviewing" note
 * - error             → keep the last message (or the idle prompt) + a visible
 *                       "couldn't reach the AI" note — never silently blank out
 * - source 'fallback' → the saved-guidance text + an "AI is busy" note
 * - source 'ai'|absent→ the message as-is (a backend without `source` reads as normal)
 * - no feedback yet   → the idle prompt
 */
export function resolveAiFeedbackView(state: AiFeedbackViewState): AiFeedbackView {
  if (state.pending) return { message: 'Reviewing your change…', tone: 'info' }

  if (state.error) {
    return {
      message: state.feedback?.feedback ?? IDLE_MESSAGE,
      tone: 'warning',
      note: "Couldn't reach the AI just now — your roadmap changes are still saved. Try another edit to retry.",
    }
  }

  if (state.feedback) {
    return {
      message: state.feedback.feedback,
      tone: state.feedback.severity,
      note:
        state.feedback.source === 'fallback'
          ? 'AI is busy right now — showing saved guidance.'
          : undefined,
    }
  }

  return { message: IDLE_MESSAGE, tone: 'info' }
}
