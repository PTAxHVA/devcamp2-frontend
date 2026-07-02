import {
  RiTimeLine,
  RiBriefcaseLine,
  RiBookOpenLine,
  RiCloudLine,
  RiStackLine,
  RiGlobalLine,
  RiTerminalBoxLine,
  RiQuestionnaireLine,
  RiComputerLine,
  RiGamepadLine,
  RiRocketLine,
  RiPlantLine,
} from 'react-icons/ri'

import { LuLayoutTemplate, LuDatabase, LuCode } from 'react-icons/lu'

export const steps = ['Welcome', 'Role', 'Goal', 'Level', 'Preferences', 'Roadmap']

export const roles = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    desc: 'Build user interfaces and interactive experiences for the web.',
    time: '3–6 months',
    icon: <LuLayoutTemplate className="text-text-placeholder h-16 w-16 stroke-[1.25]" />,
    mappedNote: undefined as string | undefined,
  },
  {
    id: 'backend',
    title: 'Backend Development',
    desc: 'Build server-side logic, APIs, and databases that power applications.',
    time: '3–6 months',
    icon: <LuDatabase className="text-text-placeholder h-16 w-16 stroke-[1.25]" />,
    mappedNote: undefined as string | undefined,
  },
  {
    id: 'fullstack',
    title: 'Fullstack Development',
    desc: 'Work on both frontend and backend to build complete applications.',
    time: '6–9 months',
    icon: <LuCode className="text-text-placeholder h-16 w-16 stroke-[1.25]" />,
    mappedNote: "No dedicated Fullstack roadmap yet — you'll start with the Frontend roadmap.",
  },
]

export const goals = [
  {
    id: 'job',
    title: 'Get a job / internship',
    desc: 'Build job-ready skills, create projects, and prepare for interviews.',
    icon: <RiBriefcaseLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'school',
    title: 'School / study',
    desc: 'Strengthen coursework, complete assignments, and prepare for exams.',
    icon: <RiBookOpenLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'project',
    title: 'Build a project',
    desc: 'Turn ideas into real projects and grow your portfolio.',
    icon: <RiComputerLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'fun',
    title: 'Learn for fun',
    desc: 'Explore topics you love and learn at your own pace.',
    icon: <RiGamepadLine className="text-brand-purple-600 h-12 w-12" />,
  },
]

export const levels = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'New to this topic. I’m starting from scratch.',
    icon: <RiPlantLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'basics',
    title: 'Know basics',
    desc: 'I understand the basics and have a little hands-on experience.',
    icon: <RiBookOpenLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'projects',
    title: 'Built small projects',
    desc: 'I’ve built projects and applied my skills.',
    icon: <RiComputerLine className="text-brand-purple-600 h-12 w-12" />,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    desc: 'I’m highly experienced and want to level up or specialize.',
    icon: <RiRocketLine className="text-brand-purple-600 h-12 w-12" />,
  },
]
export const PREFERENCE_QUESTIONS = [
  {
    id: 'weeklyTime',
    icon: <RiTimeLine className="h-6 w-6" />,
    label: 'Weekly time available',
    desc: 'How many hours can you dedicate to learning each week?',
    type: 'select',
    placeholder: 'Select time...',
    options: [
      { value: '0-5', label: '0-5 hours' },
      { value: '5-10', label: '5-10 hours' },
      { value: '10-20', label: '10-20 hours' },
      { value: '20+', label: '20+ hours' },
    ],
  },
  {
    id: 'projectType',
    icon: <RiBriefcaseLine className="h-6 w-6" />,
    label: 'Project type',
    desc: 'What type of projects interest you most?',
    type: 'select',
    placeholder: 'Select project type...',
    options: [
      { value: 'web', label: 'Web Applications' },
      { value: 'mobile', label: 'Mobile Apps' },
      { value: 'data', label: 'Data Science / AI' },
    ],
  },
  {
    id: 'learningStyle',
    icon: <RiBookOpenLine className="h-6 w-6" />,
    label: 'Learning style',
    desc: 'How do you prefer to learn?',
    type: 'select',
    placeholder: 'Select style...',
    options: [
      { value: 'video', label: 'Video Tutorials' },
      { value: 'reading', label: 'Reading Documentation' },
      { value: 'interactive', label: 'Interactive Coding' },
    ],
  },
  {
    id: 'targetTimeline',
    icon: <RiCloudLine className="h-6 w-6" />,
    label: 'Target timeline',
    desc: 'When do you want to achieve your goal?',
    type: 'select',
    placeholder: 'Select timeline...',
    options: [
      { value: '1-3', label: '1-3 months' },
      { value: '3-6', label: '3-6 months' },
      { value: '6-12', label: '6-12 months' },
    ],
  },
  {
    id: 'framework',
    icon: <RiStackLine className="h-6 w-6" />,
    label: 'Framework preference',
    desc: 'Which frontend framework would you like to focus on?',
    type: 'select',
    placeholder: 'Select framework...',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
    ],
  },
  {
    id: 'os',
    icon: <RiGlobalLine className="h-6 w-6" />,
    label: 'Operating system',
    desc: 'What operating system do you primarily use?',
    type: 'select',
    placeholder: 'Select OS...',
    options: [
      { value: 'windows', label: 'Windows' },
      { value: 'mac', label: 'macOS' },
      { value: 'linux', label: 'Linux' },
    ],
  },
  {
    id: 'cliComfort',
    icon: <RiTerminalBoxLine className="h-6 w-6" />,
    label: 'CLI comfort level',
    desc: 'How comfortable are you using the command line?',
    type: 'select',
    placeholder: 'Select comfort level...',
    options: [
      { value: 'beginner', label: 'Beginner (Never used)' },
      { value: 'intermediate', label: 'Intermediate (Can run basic commands)' },
      { value: 'advanced', label: 'Advanced (Very comfortable)' },
    ],
  },
  {
    id: 'additionalInfo',
    icon: <RiQuestionnaireLine className="h-6 w-6" />,
    label: 'Anything else?',
    desc: 'Share anything else we should know to personalize your roadmap',
    type: 'textarea',
    placeholder: 'E.g., I have a background in design...',
    required: false,
  },
]

export const LEARNING_PATH_KEYS = ['learningFramework', 'styling', 'projectDirection'] as const

// Frontend + Fullstack get the frontend-specific questions (Fullstack starts on the
// Frontend roadmap). Backend does not — so a Backend learner is never asked which
// frontend framework/styling/path to use (H11).
export const isFrontendFocusedRole = (role: string | undefined | null): boolean =>
  role === 'frontend' || role === 'fullstack'

// Preference questions for a given role: the frontend-only "framework" question is
// dropped for non-frontend roles.
export const getPreferenceQuestions = (role: string | undefined | null) =>
  PREFERENCE_QUESTIONS.filter((q) => q.id !== 'framework' || isFrontendFocusedRole(role))
