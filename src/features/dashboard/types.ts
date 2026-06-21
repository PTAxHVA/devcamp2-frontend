export interface DashboardData {
  userName?: string
  continueLearning: {
    sectionId: string
    topicId: string
    userRoadmapId: string
    topicName: string
    sectionName: string
  } | null
  roadmaps: Array<{
    id: string
    roleName: string
    progressPercentage: number
    sourceType: 'SUGGESTED' | 'CUSTOMIZED'
  }>
  weeklyProgressCounts?: number[]
  streak: {
    currentStreak: number
    longestStreak: number
    lastActivityDate: string | null
    todayCompleted: boolean
  }
  stats: { roadmapProgress: number; completedTopics: number; quizAvg: number }
  availableRolesForAdd: Array<{ roadmapId: string; roleName: string }>
}
