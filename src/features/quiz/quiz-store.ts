import { create } from 'zustand'

interface SessionQuestion {
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

export const useQuizStore = create<QuizStore>((set) => ({
  attemptId: null,
  startedAt: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  initAttempt: (attemptId, startedAt, questions) =>
    set({ attemptId, startedAt, questions, currentIndex: 0, answers: {} }),
  setAnswer: (qid, v) => set((s) => ({ answers: { ...s.answers, [qid]: v } })),
  next: () => set((s) => ({ currentIndex: Math.min(s.questions.length - 1, s.currentIndex + 1) })),
  prev: () => set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),
  reset: () =>
    set({ attemptId: null, startedAt: null, questions: [], currentIndex: 0, answers: {} }),
}))
