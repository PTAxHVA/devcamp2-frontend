/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { DashboardData } from '@/features/dashboard/types'

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Fetch both dashboard analytics and the detailed active roadmaps list
      const [dashRes, roadmapsRes] = await Promise.all([
        apiClient.get<any>('/dashboard'),
        apiClient.get<any>('/roadmaps'),
      ])

      const dashData = dashRes.data.data
      const activeRoadmaps = roadmapsRes.data.data

      // Map roadmaps with their progress from dashboard stats
      const roadmaps = activeRoadmaps.map((r: any) => {
        const progressStat = dashData.stats.progress.find((p: any) => p.roadmapId === r.roadmapId)
        return {
          id: r._id, // Must use userRoadmapId for navigation
          roleName: r.roleName || 'Personal Roadmap',
          progressPercentage: progressStat
            ? Math.round(progressStat.roadmapCompletionPercentage)
            : 0,
          sourceType: r.sourceType,
        }
      })

      // Map continue learning (take the first available one)
      let continueLearning = null
      const clItem = dashData.continueLearningList?.find((c: any) => c.currentSection)
      if (clItem) {
        continueLearning = {
          sectionId: clItem.currentSection.sectionId,
          topicId: clItem.currentTopicId,
          roadmapId: clItem.userRoadmapId,
          topicName: 'Current Topic', // Backend doesn't return topic name yet
          sectionName: clItem.currentSection.name,
        }
      }

      // Calculate todayCompleted for streak
      let todayCompleted = false
      if (dashData.streak?.lastActivityDate) {
        const lastDate = new Date(dashData.streak.lastActivityDate).toDateString()
        const today = new Date().toDateString()
        todayCompleted = lastDate === today
      }

      // Calculate average roadmap progress
      const totalProgress = roadmaps.reduce((acc: number, r: any) => acc + r.progressPercentage, 0)
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
          completedTopics: 0, // Not available in backend yet
          quizAvg: 0, // Not available in backend yet
        },
        availableRolesForAdd: (dashData.availableRolesForAdd || []).map((r: any) => ({
          roadmapId: r.id,
          roleName: r.roleName,
        })),
      }
    },
  })
}
