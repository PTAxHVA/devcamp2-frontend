import type { ReactNode } from 'react'
import { RECOMMEND_CHOICE_VALUE } from '../../data/onboarding-data'
import { LuCode, LuSparkles } from 'react-icons/lu'
import { SiMongodb, SiPostgresql, SiMysql } from 'react-icons/si'
import {
  RiReactjsLine,
  RiAngularjsLine,
  RiBootstrapLine,
  RiLayout4Line,
  RiProfileLine,
  RiDashboardLine,
  RiShoppingCartLine,
} from 'react-icons/ri'

export interface PathOption {
  id: string
  title: string
  desc: string
  icon: ReactNode
}

export interface PathSection {
  id: number
  title: string
  subtitle: string
  state: string | undefined
  setState: (val: string) => void
  options: PathOption[]
}

// A "let VORA choose" card offered on each fork step. Selecting it stores the
// RECOMMEND_CHOICE_VALUE sentinel, which the branch resolver reads as "no
// preference" and falls back to that group's recommended default branch.
const recommendOption: PathOption = {
  id: RECOMMEND_CHOICE_VALUE,
  title: 'Not sure yet',
  desc: "We'll recommend a beginner-friendly path for you.",
  icon: <LuSparkles className="text-brand-purple-600 h-10 w-10" />,
}

const str = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined)

/**
 * Learning-path fork choices for the "Choose your learning path" step. Backend
 * learners pick a database branch; everyone else picks the frontend framework,
 * styling, and project direction. Each option id doubles as the stored answer and
 * must match a seeded branch name (see resolveBranchSelectionFromAnswers).
 */
export function buildPathSections(
  role: string | undefined,
  answers: Record<string, unknown>,
  setAnswer: (key: string, value: string) => void,
): PathSection[] {
  if (role === 'backend') {
    return [
      {
        id: 1,
        title: 'Choose your database',
        subtitle: 'Pick the database you want to learn for your backend roadmap',
        state: str(answers.database),
        setState: (val) => setAnswer('database', val),
        options: [
          {
            id: 'mongodb',
            title: 'MongoDB',
            desc: 'A flexible document database that stores JSON-like records.',
            icon: <SiMongodb className="h-10 w-10 text-[#47A248]" />,
          },
          {
            id: 'postgresql',
            title: 'PostgreSQL',
            desc: 'A powerful, standards-based relational (SQL) database.',
            icon: <SiPostgresql className="h-10 w-10 text-[#4169E1]" />,
          },
          {
            id: 'mysql',
            title: 'MySQL',
            desc: 'A widely-used relational database, used here with Prisma.',
            icon: <SiMysql className="h-10 w-10 text-[#4479A1]" />,
          },
          recommendOption,
        ],
      },
    ]
  }

  return [
    {
      id: 1,
      title: 'Choose your framework',
      subtitle: 'Select your framework you want to focus',
      state: str(answers.learningFramework),
      setState: (val) => setAnswer('learningFramework', val),
      options: [
        {
          id: 'react',
          title: 'React',
          desc: 'A popular library for building user interfaces.',
          icon: <RiReactjsLine className="h-10 w-10 text-[#61DAFB]" />,
        },
        {
          id: 'vue',
          title: 'Vue',
          desc: 'A progressive framework for building modern web apps.',
          icon: <LuCode className="h-10 w-10 text-[#41B883]" />,
        },
        {
          id: 'angular',
          title: 'Angular',
          desc: 'A full-featured framework for scalable applications.',
          icon: <RiAngularjsLine className="h-10 w-10 text-[#DD0031]" />,
        },
        recommendOption,
      ],
    },
    {
      id: 2,
      title: 'Choose your styling preferences',
      subtitle: 'Pick your preferred way to style your components and layouts',
      state: str(answers.styling),
      setState: (val) => setAnswer('styling', val),
      options: [
        {
          id: 'tailwind',
          title: 'Tailwind CSS',
          desc: 'A utility-first framework for rapid UI development.',
          icon: <RiLayout4Line className="h-10 w-10 text-[#38bdf8]" />,
        },
        {
          id: 'bootstrap',
          title: 'Bootstrap',
          desc: 'A component-rich framework for fast, responsive UIs.',
          icon: <RiBootstrapLine className="h-10 w-10 text-[#7952B3]" />,
        },
        recommendOption,
      ],
    },
    {
      id: 3,
      title: 'Choose your project direction',
      subtitle: 'Pick the type of projects you want to build along way.',
      state: str(answers.projectDirection),
      setState: (val) => setAnswer('projectDirection', val),
      options: [
        {
          id: 'portfolio',
          title: 'Portfolio',
          desc: 'Build a personal website to showcase your work.',
          icon: <RiProfileLine className="text-text-secondary h-10 w-10" />,
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          desc: 'Create interactive interfaces for data visualization.',
          icon: <RiDashboardLine className="text-text-secondary h-10 w-10" />,
        },
        {
          id: 'ecommerce',
          title: 'E-commerce',
          desc: 'Develop modern online shopping experiences.',
          icon: <RiShoppingCartLine className="text-text-secondary h-10 w-10" />,
        },
      ],
    },
  ]
}
