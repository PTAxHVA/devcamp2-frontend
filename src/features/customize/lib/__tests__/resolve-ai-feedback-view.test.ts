import { describe, expect, it } from 'vitest'
import { resolveAiFeedbackView, type AiFeedbackData } from '../resolve-ai-feedback-view'

const IDLE = 'Add or remove a topic and the AI will tell you how it affects your path.'
const aiNote: AiFeedbackData = {
  feedback: 'Nice fit for your goal.',
  severity: 'info',
  source: 'ai',
}

describe('resolveAiFeedbackView', () => {
  it('shows a reviewing note while pending', () => {
    const view = resolveAiFeedbackView({ pending: true, error: false, feedback: null })
    expect(view.message).toMatch(/reviewing/i)
    expect(view.note).toBeUndefined()
  })

  it('shows a real AI note with no degrade note for source "ai"', () => {
    const view = resolveAiFeedbackView({ pending: false, error: false, feedback: aiNote })
    expect(view.message).toBe('Nice fit for your goal.')
    expect(view.tone).toBe('info')
    expect(view.note).toBeUndefined()
  })

  it('adds an "AI is busy" note for source "fallback" but still shows the guidance', () => {
    const fallback: AiFeedbackData = {
      feedback: 'Consider prerequisites before adding.',
      severity: 'warning',
      source: 'fallback',
    }
    const view = resolveAiFeedbackView({ pending: false, error: false, feedback: fallback })
    expect(view.message).toBe('Consider prerequisites before adding.')
    expect(view.tone).toBe('warning')
    expect(view.note).toMatch(/busy/i)
  })

  it('treats a missing source (older backend) as a normal note — no degrade note', () => {
    const noSource: AiFeedbackData = { feedback: 'Looks good.', severity: 'info' }
    const view = resolveAiFeedbackView({ pending: false, error: false, feedback: noSource })
    expect(view.message).toBe('Looks good.')
    expect(view.note).toBeUndefined()
  })

  it('surfaces a visible error note instead of silently blanking out', () => {
    const view = resolveAiFeedbackView({ pending: false, error: true, feedback: aiNote })
    // Keeps the last message, flips to warning tone, and shows a "couldn't reach" note.
    expect(view.message).toBe('Nice fit for your goal.')
    expect(view.tone).toBe('warning')
    expect(view.note).toMatch(/couldn't reach the ai/i)
  })

  it('on error with no prior feedback falls back to the idle prompt + error note', () => {
    const view = resolveAiFeedbackView({ pending: false, error: true, feedback: null })
    expect(view.message).toBe(IDLE)
    expect(view.note).toMatch(/couldn't reach the ai/i)
  })

  it('shows the idle prompt when there is no feedback yet', () => {
    const view = resolveAiFeedbackView({ pending: false, error: false, feedback: null })
    expect(view.message).toBe(IDLE)
    expect(view.tone).toBe('info')
    expect(view.note).toBeUndefined()
  })
})
