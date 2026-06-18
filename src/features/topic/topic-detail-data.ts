import type { IconType } from 'react-icons'
import { RiFileTextLine, RiPlayCircleLine, RiCodeSSlashLine, RiFileList2Line } from 'react-icons/ri'

export interface LearningMaterial {
  type: string
  title: string
  duration: string
  icon: IconType
}

export interface TopicDataType {
  TopicNumber: number
  title: string
  description: string
  stats: {
    duration: string
    difficulty: string
    topic: string
  }
  outcomes: string[]
  materials: LearningMaterial[]
  navigation: {
    previous: { Topic: string; title: string }
    next: { Topic: string; title: string }
  }
}
export const TopicDataMock: TopicDataType = {
  TopicNumber: 2,
  title: 'HTML Document Structure',
  description:
    'Understand the basic structure of an HTML document, including the purpose of key tags and how browsers interpret HTML.',
  stats: {
    duration: '30-40 min',
    difficulty: 'Beginner',
    topic: 'HTML & CSS',
  },
  outcomes: [
    'Explain the structure of a basic HTML document',
    'Identify the purpose of the <html>, <head>, and <body> tags',
    'Use <title> and meta tags for basic document information',
    'Create a simple HTML file with a valid structure',
  ],
  materials: [
    {
      type: 'Lesson',
      title: 'HTML Document Structure (Text)',
      duration: '8 min',
      icon: RiFileTextLine,
    },
    { type: 'Video', title: 'Anatomy of an HTML Page', duration: '12 min', icon: RiPlayCircleLine },
    {
      type: 'Interactive Demo',
      title: 'Explore HTML Structure',
      duration: '10 min',
      icon: RiCodeSSlashLine,
    },
    {
      type: 'Cheat Sheet',
      title: 'HTML Basic Tags Reference',
      duration: '2 min',
      icon: RiFileList2Line,
    },
  ],
  navigation: {
    previous: { Topic: 'Topic 1', title: 'Introduction to HTML' },
    next: { Topic: 'Topic 3', title: 'HTML Headings & Paragraphs' },
  },
}
