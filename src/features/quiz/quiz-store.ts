import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionQuestion {
  id: string
  type: 'mcq' | 'fill'
  content: string
  options?: Array<{ id: string; content: string }>
}

export interface QuizStore {
  attemptId: string | null
  startedAt: string | null
  questions: SessionQuestion[]
  currentIndex: number
  answers: Record<string, string>
  initAttempt: (id: string, startedAt: string, qs: SessionQuestion[]) => void
  setAnswer: (qid: string, v: string) => void
  next: () => void
  prev: () => void
  reset: () => void
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      attemptId: null,
      startedAt: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      initAttempt: (attemptId, startedAt, questions) =>
        set((s) => {
          // Resuming the SAME attempt (a reload, or the resume-via-409 path) must
          // keep the answers already chosen + the current question — only a fresh
          // attempt starts blank. questions/startedAt always come from the server.
          const sameAttempt = s.attemptId === attemptId
          const lastIndex = Math.max(0, questions.length - 1)
          return {
            attemptId,
            startedAt,
            questions,
            currentIndex: sameAttempt ? Math.min(s.currentIndex, lastIndex) : 0,
            answers: sameAttempt ? s.answers : {},
          }
        }),
      setAnswer: (qid, v) => set((s) => ({ answers: { ...s.answers, [qid]: v } })),
      next: () =>
        set((s) => ({ currentIndex: Math.min(s.questions.length - 1, s.currentIndex + 1) })),
      prev: () => set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),
      reset: () =>
        set({ attemptId: null, startedAt: null, questions: [], currentIndex: 0, answers: {} }),
    }),
    {
      // Persist only what a reload can't recover: the attempt id, the chosen answers
      // and the current question. questions + startedAt are re-fetched on load, so
      // they stay out (startedAt especially must stay server-authoritative for the
      // timer). The page's reset()-on-unmount clears this on a normal quiz exit; it
      // survives only a hard reload, where React runs no cleanup.
      name: 'vora-quiz-attempt',
      version: 1,
      partialize: (state) => ({
        attemptId: state.attemptId,
        currentIndex: state.currentIndex,
        answers: state.answers,
      }),
    },
  ),
)
