import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import type { DashboardData } from '@/features/dashboard/types'

interface BEProgressStat {
  roadmapId: string
  roadmapCompletionPercentage: number
}

interface BERoadmap {
  _id: string
  roadmapId: string
  roleName?: string
  sourceType?: 'SUGGESTED' | 'CUSTOMIZED'
}

interface BEContinueLearning {
  userRoadmapId: string
  roadmapId: string
  currentTopicId: string | null
  currentSection: { sectionId: string; name: string } | null
}

interface BEAvailableRole {
  id: string
  roleName: string
}

interface BEStreak {
  streak: number
  longestStreak: number
  lastActivityDate: string | null
}

type BEWeeklyProgress = number[] | { counts?: number[] }

interface BEDashboardRes {
  continueLearningList?: BEContinueLearning[]
  roadmaps: string[]
  streak?: BEStreak
  stats: {
    progress: BEProgressStat[]
    level: string
  }
  availableRolesForAdd?: BEAvailableRole[]
  weeklyProgress?: BEWeeklyProgress
  weeklyProgressCounts?: number[]
}

// NOTE: GET /dashboard does not yet expose weekly counts, so this resolves to
// undefined today and the Weekly Progress card stays hidden (better than showing
// fabricated bars). Wired defensively for when the backend surfaces the field.
function normalizeWeeklyProgressCounts(value: unknown): number[] | undefined {
  const counts = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && 'counts' in value
      ? (value as { counts?: unknown }).counts
      : undefined

  if (!Array.isArray(counts) || counts.length !== 7) return undefined

  // Reject non-numeric entries rather than coercing null/''/false to 0.
  const normalized = counts.map((count) => (typeof count === 'number' ? count : NaN))
  return normalized.every((count) => Number.isFinite(count) && count >= 0) ? normalized : undefined
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [dashRes, roadmapsRes] = await Promise.all([
        apiClient.get<{ data: BEDashboardRes }>('/dashboard'),
        apiClient.get<{ data: BERoadmap[] }>('/roadmaps'),
      ])
      const dashData = dashRes.data.data

      const activeRoadmaps = roadmapsRes.data.data || []

      const roadmaps = activeRoadmaps.map((r) => {
        const progressStat = dashData.stats?.progress?.find((p) => p.roadmapId === r.roadmapId)
        return {
          id: r._id,
          roleName: r.roleName || 'Personal Roadmap',
          progressPercentage: progressStat
            ? Math.round(progressStat.roadmapCompletionPercentage)
            : 0,
          sourceType: r.sourceType || 'SUGGESTED',
        }
      })

      let continueLearning = null
      const clItem = dashData.continueLearningList?.find((c) => c.currentSection)
      if (clItem && clItem.currentSection && clItem.currentTopicId) {
        let topicName = 'Current Topic'
        try {
          const topicRes = await apiClient.get<{ data: { name: string } }>(
            `/topics/${clItem.currentTopicId}`,
          )
          if (topicRes.data?.data?.name) {
            topicName = topicRes.data.data.name
          }
        } catch (err) {
          logger.error(
            'Failed to fetch topic name for continue learning card:',
            err instanceof Error ? err.message : String(err),
          )
        }

        continueLearning = {
          sectionId: clItem.currentSection.sectionId,
          topicId: clItem.currentTopicId,
          userRoadmapId: clItem.userRoadmapId,
          topicName,
          sectionName: clItem.currentSection.name,
        }
      }

      let todayCompleted = false
      if (dashData.streak?.lastActivityDate) {
        const lastDate = new Date(dashData.streak.lastActivityDate).toDateString()
        const today = new Date().toDateString()
        todayCompleted = lastDate === today
      }

      const totalProgress = roadmaps.reduce((acc, r) => acc + r.progressPercentage, 0)
      const avgProgress = roadmaps.length > 0 ? Math.round(totalProgress / roadmaps.length) : 0
      const weeklyProgressCounts =
        normalizeWeeklyProgressCounts(dashData.weeklyProgressCounts) ??
        normalizeWeeklyProgressCounts(dashData.weeklyProgress)

      return {
        continueLearning,
        roadmaps,
        weeklyProgressCounts,
        streak: {
          currentStreak: dashData.streak?.streak || 0,
          longestStreak: dashData.streak?.longestStreak || 0,
          lastActivityDate: dashData.streak?.lastActivityDate || null,
          todayCompleted,
        },
        stats: {
          roadmapProgress: avgProgress,
          completedTopics: -1,
          quizAvg: -1,
        },
        availableRolesForAdd: (dashData.availableRolesForAdd || []).map((r) => ({
          roadmapId: r.id,
          roleName: r.roleName,
        })),
      }
    },
    retry: (failureCount, error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status
        if (status && status >= 400 && status < 500) return false
      }

      return failureCount < 3
    },
  })
}
