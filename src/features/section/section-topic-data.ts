import type { IconType } from 'react-icons'
import { RiFileTextLine, RiPlayCircleLine, RiBookOpenLine, RiCodeSSlashLine } from 'react-icons/ri'

/* --------------------------------- Types --------------------------------- */
export type Status = 'Completed' | 'In Progress' | 'Not Started'

export interface ResourceItem {
  type: string
  title: string
  meta: string
  icon: IconType
  external?: boolean
}

export interface SectionItem {
  n: number
  title: string
  desc: string
  duration: string
  status: Status
}

export interface Topic {
  index: number
  title: string
  tag: string
  progress: number
  description: string
  objectives: string[]
  prerequisites: string[]
  resources: ResourceItem[]
  sections: SectionItem[]
  summary: {
    estimatedTime: string
    sections: number
    resources: number
    difficulty: string
    importance: string
    completed: number
  }
  upNext: { index: number; title: string; time: string }
}

/* ----------------------------- Dữ liệu mẫu ------------------------------ */
export const topic: Topic = {
  index: 4,
  title: 'DOM & Events',
  tag: 'Required',
  progress: 40,
  description:
    'Learn how the Document Object Model (DOM) represents web pages and how to interact ' +
    "with it using JavaScript. You'll also explore event handling to create responsive, " +
    'interactive web applications.',
  objectives: [
    'Understand the structure of the DOM tree',
    'Select and manipulate DOM elements',
    'Handle user events effectively',
    'Build interactive UI components',
  ],
  prerequisites: ['HTML & CSS', 'JavaScript Basics', 'Basic Web Development'],
  resources: [
    { type: 'Article', title: 'Understanding the DOM', meta: '8 min read', icon: RiFileTextLine },
    { type: 'Video', title: 'DOM & Events Crash Course', meta: '16 min', icon: RiPlayCircleLine },
    {
      type: 'Documentation',
      title: 'MDN: DOM Guide',
      meta: 'External link',
      icon: RiBookOpenLine,
      external: true,
    },
    {
      type: 'Project',
      title: 'Build an Interactive Todo App',
      meta: 'Practice Project',
      icon: RiCodeSSlashLine,
    },
  ],
  sections: [
    {
      n: 1,
      title: 'The DOM Tree',
      desc: 'Explore the structure and nodes of the DOM.',
      duration: '10 min',
      status: 'Completed',
    },
    {
      n: 2,
      title: 'Selecting Elements',
      desc: 'Learn different ways to select elements in the DOM.',
      duration: '12 min',
      status: 'Completed',
    },
    {
      n: 3,
      title: 'Manipulating the DOM',
      desc: 'Create, update, and remove elements dynamically.',
      duration: '15 min',
      status: 'In Progress',
    },
    {
      n: 4,
      title: 'Events & Event Handling',
      desc: 'Respond to user actions with event listeners.',
      duration: '18 min',
      status: 'Not Started',
    },
  ],
  summary: {
    estimatedTime: '55 min',
    sections: 4,
    resources: 4,
    difficulty: 'Intermediate',
    importance: 'High',
    completed: 2,
  },
  upNext: { index: 5, title: 'Git & GitHub', time: '14 min' },
}
