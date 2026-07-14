import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizStore, type SessionQuestion } from '@/features/quiz/quiz-store'

const q = (id: string): SessionQuestion => ({ id, type: 'mcq', content: id })

describe('useQuizStore initAttempt (N2)', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuizStore.getState().reset()
  })

  it('keeps chosen answers + the current question when the SAME attempt re-inits', () => {
    useQuizStore.getState().initAttempt('a1', '2026-01-01T00:00:00Z', [q('q1'), q('q2'), q('q3')])
    useQuizStore.getState().setAnswer('q1', 'x')
    useQuizStore.getState().next() // currentIndex -> 1

    // A reload refetches the same attempt and calls initAttempt again.
    useQuizStore.getState().initAttempt('a1', '2026-01-01T00:05:00Z', [q('q1'), q('q2'), q('q3')])

    const state = useQuizStore.getState()
    expect(state.answers).toEqual({ q1: 'x' })
    expect(state.currentIndex).toBe(1)
  })

  it('starts blank for a DIFFERENT attempt (a new quiz)', () => {
    useQuizStore.getState().initAttempt('a1', 't', [q('q1'), q('q2')])
    useQuizStore.getState().setAnswer('q1', 'x')
    useQuizStore.getState().next()

    useQuizStore.getState().initAttempt('a2', 't', [q('q1'), q('q2')])

    const state = useQuizStore.getState()
    expect(state.answers).toEqual({})
    expect(state.currentIndex).toBe(0)
  })

  it('clamps a restored index that overruns the question count', () => {
    useQuizStore.getState().initAttempt('a1', 't', [q('q1'), q('q2'), q('q3'), q('q4')])
    useQuizStore.getState().next()
    useQuizStore.getState().next()
    useQuizStore.getState().next() // currentIndex -> 3

    useQuizStore.getState().initAttempt('a1', 't', [q('q1'), q('q2')])

    expect(useQuizStore.getState().currentIndex).toBe(1)
  })

  it('persists attempt id + answers + index, but not questions or startedAt', () => {
    useQuizStore.getState().initAttempt('a1', '2026-01-01T00:00:00Z', [q('q1')])
    useQuizStore.getState().setAnswer('q1', 'x')

    const saved = JSON.parse(localStorage.getItem('vora-quiz-attempt')!)
    expect(saved.state.attemptId).toBe('a1')
    expect(saved.state.answers).toEqual({ q1: 'x' })
    expect(saved.state.currentIndex).toBe(0)
    expect(saved.state.questions).toBeUndefined()
    expect(saved.state.startedAt).toBeUndefined()
  })
})
