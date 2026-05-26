export interface DashboardData {
  continueLearning: { sectionId: string; topicName: string; sectionName: string } | null
  roadmaps: Array<{
    id: string
    roleName: string
    progressPercentage: number
    sourceType: 'suggested' | 'customized' | 'from_library'
  }>
  streak: {
    currentStreak: number
    longestStreak: number
    lastActivityDate: string | null
    todayCompleted: boolean
  }
  stats: { roadmapProgress: number; completedTopics: number; quizAvg: number }
  availableRolesForAdd: Array<{ masterRoadmapId: string; roleName: string }>
}
