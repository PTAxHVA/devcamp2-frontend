import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { DashboardData } from '@/features/dashboard/types'

interface BEProgressStat {
  roadmapId: string
  roadmapCompletionPercentage: number
}

interface BERoadmap {
  _id: string
  roadmapId: string
  roleName?: string
  sourceType: 'SUGGESTED' | 'CUSTOMIZED'
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

interface BEDashboardRes {
  continueLearningList?: BEContinueLearning[]
  roadmaps: BERoadmap[]
  streak?: BEStreak
  stats: {
    progress: BEProgressStat[]
    level: string
  }
  availableRolesForAdd?: BEAvailableRole[]
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const dashRes = await apiClient.get<{ data: BEDashboardRes }>('/dashboard')
      const dashData = dashRes.data.data

      // Use roadmaps from dashboard payload directly
      const activeRoadmaps = dashData.roadmaps || []

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
          console.error('Failed to fetch topic name for continue learning card:', err)
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

      return {
        continueLearning,
        roadmaps,
        streak: {
          currentStreak: dashData.streak?.streak || 0,
          longestStreak: dashData.streak?.longestStreak || 0,
          lastActivityDate: dashData.streak?.lastActivityDate || null,
          todayCompleted,
        },
        stats: {
          roadmapProgress: avgProgress,
          // TODO: completedTopics and quizAvg are not returned by the backend /dashboard yet.
          // Need to supplement BE. For now, setting to -1 so UI doesn't mislead with "0".
          completedTopics: -1,
          quizAvg: -1,
        },
        availableRolesForAdd: (dashData.availableRolesForAdd || []).map((r) => ({
          roadmapId: r.id,
          roleName: r.roleName,
        })),
      }
    },
  })
}
