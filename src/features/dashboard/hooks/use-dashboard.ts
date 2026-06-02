import { useQuery } from '@tanstack/react-query'
import type { DashboardData } from '@/features/dashboard/types'

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Giả lập độ trễ mạng 500ms
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        continueLearning: null,
        roadmaps: [
          {
            id: 'rm-frontend-1',
            roleName: 'Frontend Web Development',
            progressPercentage: 42,
            sourceType: 'SUGGESTED',
          },
          {
            id: 'rm-backend-1',
            roleName: 'Backend Development',
            progressPercentage: 18,
            sourceType: 'CUSTOMIZED',
          },
        ],
        streak: {
          currentStreak: 3,
          longestStreak: 12,
          lastActivityDate: new Date().toISOString(),
          todayCompleted: true,
        },
        stats: { roadmapProgress: 20, completedTopics: 4, quizAvg: 85 },
        availableRolesForAdd: [],
      }
    },
  })
}
