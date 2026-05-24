import {
  RiBriefcaseLine,
  RiBookOpenLine,
  RiComputerLine,
  RiGamepadLine,
  RiPlantLine,
  RiRocketLine,
} from 'react-icons/ri'

import { LuLayoutTemplate, LuDatabase, LuCode } from 'react-icons/lu'

export const steps = ['Welcome', 'Role', 'Goal', 'Level', 'Preferences', 'Roadmap']

export const roles = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    desc: 'Build user interfaces and interactive experiences for the web.',
    time: '3–6 months',
    icon: <LuLayoutTemplate className="w-16 h-16 text-slate-400 stroke-[1.25]" />,
  },
  {
    id: 'backend',
    title: 'Backend Development',
    desc: 'Build server-side logic, APIs, and databases that power applications.',
    time: '3–6 months',
    icon: <LuDatabase className="w-16 h-16 text-slate-400 stroke-[1.25]" />,
  },
  {
    id: 'fullstack',
    title: 'Fullstack Development',
    desc: 'Work on both frontend and backend to build complete applications.',
    time: '6–9 months',
    icon: <LuCode className="w-16 h-16 text-slate-400 stroke-[1.25]" />,
  },
]

export const goals = [
  {
    id: 'job',
    title: 'Get a job / internship',
    desc: 'Build job-ready skills, create projects, and prepare for interviews.',
    icon: <RiBriefcaseLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'school',
    title: 'School / study',
    desc: 'Strengthen coursework, complete assignments, and prepare for exams.',
    icon: <RiBookOpenLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'project',
    title: 'Build a project',
    desc: 'Turn ideas into real projects and grow your portfolio.',
    icon: <RiComputerLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'fun',
    title: 'Learn for fun',
    desc: 'Explore topics you love and learn at your own pace.',
    icon: <RiGamepadLine className="w-12 h-12 text-brand-purple-600" />,
  },
]

export const levels = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'New to this topic. I’m starting from scratch.',
    icon: <RiPlantLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'basics',
    title: 'Know basics',
    desc: 'I understand the basics and have a little hands-on experience.',
    icon: <RiBookOpenLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'projects',
    title: 'Built small projects',
    desc: 'I’ve built projects and applied my skills.',
    icon: <RiComputerLine className="w-12 h-12 text-brand-purple-600" />,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    desc: 'I’m highly experienced and want to level up or specialize.',
    icon: <RiRocketLine className="w-12 h-12 text-brand-purple-600" />,
  },
]
