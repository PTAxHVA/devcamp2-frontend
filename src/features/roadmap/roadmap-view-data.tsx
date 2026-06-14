export interface RoadmapInfo {
  title: string
  description: string
  duration: string
  topicsCount: number
  difficulty: string
  tag: string
}

export interface TopicDetails {
  id: number
  title: string
  progress: number
  prerequisites: string[]
  description: string
  learningOutcomes: string[]
}
export const roadmapInfo: RoadmapInfo = {
  title: 'Frontend Web Development',
  description: 'Learn building interactive and responsive web interfaces from the ground up.',
  duration: '8-10 weeks',
  topicsCount: 24,
  difficulty: 'Beginner',
  tag: 'Recommended',
}
export const selectedTopicDetails: TopicDetails = {
  id: 3,
  title: 'JavaScript Basics',
  progress: 45,
  prerequisites: ['Web Fundamentals', 'HTML & CSS'],
  description:
    'Learn the core concepts of JavaScript, the language that powers the web. Understand variables, data types, functions, and control flow to write your first scripts with confidence.',
  learningOutcomes: [
    'Understand JavaScript syntax and structure',
    'Work with variables, types, and operators',
    'Use functions and control flow',
    'Manipulate data with arrays and objects',
    'Debug and test your code',
  ],
}
