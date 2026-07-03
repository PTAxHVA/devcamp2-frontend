import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import type { DashboardData } from '@/features/dashboard/types'
import { deriveCurrentWeekActivity } from '@/features/dashboard/lib/streak-activity'

interface BEProgressStat {
  roadmapId: string
  roadmapCompletionPercentage: number
  totalSections?: number
  totalCompletedSections?: number
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
    completedTopics?: number
    quizAvg?: number | null
  }
  availableRolesForAdd?: BEAvailableRole[]
  weeklyProgress?: BEWeeklyProgress
  weeklyProgressCounts?: number[]
}

// GET /dashboard returns a 7-day `weeklyProgress` array (sections completed per day
// this week, Mon->Sun, UTC+7). Normalize defensively — reject malformed shapes
// rather than coercing null/''/false to 0 — and stay hidden if the field is absent.
export function normalizeWeeklyProgressCounts(value: unknown): number[] | undefined {
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

// Fallback per-day counts when the BE returns no usable `weeklyProgress` (older
// deploy, cold-start race). Marks each day inside the current streak window as
// active (1) using the SAME derivation the streak calendar falls back to, so the
// Weekly Progress chart can never contradict the calendar. Returns undefined when
// there is no activity, keeping the chart hidden rather than drawing an empty axis.
export function deriveWeeklyCountsFromStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  today = new Date(),
): number[] | undefined {
  const activity = deriveCurrentWeekActivity(currentStreak, lastActivityDate, today)
  return activity.some(Boolean) ? activity.map((active) => (active ? 1 : 0)) : undefined
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

        // Feed the card the roadmap's real name + progress (H6) — it already lives
        // in the mapped roadmaps list + the per-roadmap progress stat, it just
        // wasn't threaded through, so the card showed 0% / "0 of 0".
        const clRoadmap = roadmaps.find((rm) => rm.id === clItem.userRoadmapId)
        const progressStat = dashData.stats?.progress?.find((p) => p.roadmapId === clItem.roadmapId)

        continueLearning = {
          sectionId: clItem.currentSection.sectionId,
          topicId: clItem.currentTopicId,
          userRoadmapId: clItem.userRoadmapId,
          topicName,
          sectionName: clItem.currentSection.name,
          roadmapName: clRoadmap?.roleName ?? 'Current roadmap',
          // Prefer the mapped roadmap's %, but fall back to the progress stat so the
          // card can't show a false 0% if the /roadmaps join ever misses.
          progressPercentage:
            clRoadmap?.progressPercentage ??
            (progressStat ? Math.round(progressStat.roadmapCompletionPercentage) : 0),
          completedSections: progressStat?.totalCompletedSections ?? 0,
          totalSections: progressStat?.totalSections ?? 0,
        }
      }

      const currentStreak = dashData.streak?.streak || 0
      const lastActivityDate = dashData.streak?.lastActivityDate || null

      let todayCompleted = false
      if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate).toDateString()
        const today = new Date().toDateString()
        todayCompleted = lastDate === today
      }

      const totalProgress = roadmaps.reduce((acc, r) => acc + r.progressPercentage, 0)
      const avgProgress = roadmaps.length > 0 ? Math.round(totalProgress / roadmaps.length) : 0

      // Primary source: BE per-day counts. When the BE omits/malforms the field
      // (older deploy, cold-start race) fall back to the streak window so the chart
      // stays consistent with the streak calendar instead of sitting empty while the
      // calendar lights up "today" — the exact contradiction users reported.
      const weeklyProgressCounts =
        normalizeWeeklyProgressCounts(dashData.weeklyProgressCounts) ??
        normalizeWeeklyProgressCounts(dashData.weeklyProgress) ??
        deriveWeeklyCountsFromStreak(currentStreak, lastActivityDate)

      return {
        continueLearning,
        roadmaps,
        weeklyProgressCounts,
        streak: {
          currentStreak,
          longestStreak: dashData.streak?.longestStreak || 0,
          lastActivityDate,
          activityDays: weeklyProgressCounts?.map((count) => count > 0),
          todayCompleted,
        },
        stats: {
          roadmapProgress: avgProgress,
          // Real numbers from the BE (H5). Sentinel -1 → StatsGrid shows "--" when
          // the field is absent (older deploy) or quizAvg is null (no attempts yet).
          completedTopics: dashData.stats?.completedTopics ?? -1,
          quizAvg: dashData.stats?.quizAvg ?? -1,
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
