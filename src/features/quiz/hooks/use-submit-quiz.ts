import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface SubmitQuizResult {
  quizAttemptId: string
  score: number
  isPassed: boolean
  cooldownUntil?: string | null
}

type SubmitAnswer =
  | { questionId: string; selectedOptionId: string; userInput?: never }
  | { questionId: string; userInput: string; selectedOptionId?: never }

interface ExistingQuizResult {
  quizAttempt: {
    attemptId: string
    score: number
    isPassed: boolean
    cooldownUntil?: string | null
  }
}

async function readExistingResult(attemptId: string): Promise<SubmitQuizResult> {
  const res = await apiClient.get<{ success: boolean; data: ExistingQuizResult }>(
    `/attempts/${attemptId}/result`,
  )
  const result = res.data.data.quizAttempt
  return {
    quizAttemptId: result.attemptId,
    score: result.score,
    isPassed: result.isPassed,
    cooldownUntil: result.cooldownUntil,
  }
}

export function useSubmitQuiz(attemptId: string) {
  const qc = useQueryClient()

  return useMutation<SubmitQuizResult, Error, SubmitAnswer[]>({
    mutationFn: async (answers) => {
      try {
        const res = await apiClient.post<{ success: boolean; data: SubmitQuizResult }>(
          `/attempts/${attemptId}/submit`,
          { answers },
        )
        return res.data.data
      } catch (error) {
        if (isAxiosError(error) && (!error.response || error.response.status === 409)) {
          try {
            return await readExistingResult(attemptId)
          } catch {
            // Preserve the original submit error when no canonical result exists.
          }
        }
        throw error
      }
    },
    onSuccess: (result) => {
      // The attempt id is reused across retries, so its cached result would be
      // served stale (60s staleTime) — invalidate it so the pass/fail page
      // always renders the freshly graded attempt, not the previous one.
      qc.invalidateQueries({ queryKey: ['attempt-result', result.quizAttemptId] })
      if (result.isPassed) {
        qc.invalidateQueries({ queryKey: ['dashboard'] })
        qc.invalidateQueries({ queryKey: ['topic-detail'] })
        qc.invalidateQueries({ queryKey: ['section-detail'] })
        qc.invalidateQueries({ queryKey: ['section-quiz'] })
        qc.invalidateQueries({ queryKey: ['roadmap-detail'] })
      }
    },
    onError: () => toast.error('Failed to submit quiz, please try again.'),
  })
}
