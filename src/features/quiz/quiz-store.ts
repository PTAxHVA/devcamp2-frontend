import { create } from 'zustand'

// Định nghĩa kiểu dữ liệu cho một câu hỏi
interface SessionQuestion {
  id: string
  type: 'mcq' | 'fill'
  content: string
  options?: Array<{ id: string; content: string }>
}

// Cấu trúc Store
interface QuizStore {
  attemptId: string | null
  questions: SessionQuestion[]
  currentIndex: number
  answers: Record<string, string>

  initAttempt: (id: string, qs: SessionQuestion[]) => void
  setAnswer: (qid: string, v: string) => void
  next: () => void
  prev: () => void
  reset: () => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  attemptId: null,
  questions: [],
  currentIndex: 0,
  answers: {},

  initAttempt: (attemptId, questions) =>
    set({ attemptId, questions, currentIndex: 0, answers: {} }),

  setAnswer: (qid, v) => set((s) => ({ answers: { ...s.answers, [qid]: v } })),

  next: () => set((s) => ({ currentIndex: Math.min(s.questions.length - 1, s.currentIndex + 1) })),

  prev: () => set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),

  reset: () => set({ attemptId: null, questions: [], currentIndex: 0, answers: {} }),
}))
