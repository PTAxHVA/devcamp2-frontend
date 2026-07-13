import type { IconType } from 'react-icons'
import { RiMapPinLine, RiBookOpenLine, RiHome6Line, RiPassportLine } from 'react-icons/ri'
import { TbTargetArrow } from 'react-icons/tb'

export interface QuickLink {
  to: string
  title: string
  description: string
  Icon: IconType
}

/** Shortcuts to the real flows a learner reaches for from the help page. */
export const QUICK_LINKS: QuickLink[] = [
  {
    to: '/roadmaps',
    title: 'Browse roadmaps',
    description: 'Explore curated roadmaps by role and enroll.',
    Icon: RiMapPinLine,
  },
  {
    to: '/my-learning',
    title: 'My Learning',
    description: 'Continue your active roadmap and sections.',
    Icon: RiBookOpenLine,
  },
  {
    to: '/dashboard',
    title: 'Dashboard',
    description: 'See your progress, streak and stats.',
    Icon: RiHome6Line,
  },
  {
    to: '/passport',
    title: 'Skill Passport',
    description: 'Share your quiz-verified skills.',
    Icon: RiPassportLine,
  },
  {
    to: '/goals',
    title: 'Career goals',
    description: 'Check your job-readiness gap for a role.',
    Icon: TbTargetArrow,
  },
]

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  label: string
  items: FaqItem[]
}

// Every answer is grounded in a real VORA behaviour. Cold-start is described
// softly on purpose — no hard second-count that could go stale.
export const FAQ_GROUPS: FaqGroup[] = [
  {
    label: 'Getting started',
    items: [
      {
        question: 'How do I get a roadmap?',
        answer:
          'After you sign up, a short onboarding asks about your role (Frontend or Backend), your preferred framework and your goals. VORA then arranges a curated roadmap for you — you can accept it, customize it, or browse others.',
      },
      {
        question: 'How many roadmaps can I follow at once?',
        answer:
          'Up to two active roadmaps (for example Frontend + Backend). Add another role from your dashboard, or remove one to swap.',
      },
      {
        question: 'Does VORA generate roadmaps with AI?',
        answer:
          'No — roadmaps and their topics are hand-curated by the team. AI only helps order and personalize your roadmap and give feedback; it never invents topics outside the curated library.',
      },
    ],
  },
  {
    label: 'Quizzes, progress & streak',
    items: [
      {
        question: 'How does progress work?',
        answer:
          'Progress is quiz-verified, not self-reported. Each section has a 5-question quiz; score 80% or higher to complete that section and move on.',
      },
      {
        question: 'I failed a quiz — can I retry?',
        answer:
          'Yes. After a short cooldown (about a minute) you can start the quiz again. Your answers are reviewed so you know exactly what to fix.',
      },
      {
        question: 'How is my streak counted?',
        answer:
          'Complete at least one section quiz in a day to keep your streak — it is based on effort, not just logging in.',
      },
    ],
  },
  {
    label: 'Roadmaps & customization',
    items: [
      {
        question: "Can I change what's in my roadmap?",
        answer:
          'Yes — open Customize to add or remove topics. Branch choices (framework, styling, database) appear as selectable paths, and topics you removed can be added back from the topic picker.',
      },
      {
        question: 'What are the ghosted nodes in the editor?',
        answer:
          "They are the branches you didn't pick — for example an alternative framework. Add one to learn it in parallel; your current path stays intact.",
      },
    ],
  },
  {
    label: 'Signature features',
    items: [
      {
        question: 'What is the Skill Passport?',
        answer:
          'A shareable profile of your quiz-verified skills. It is private by default — turn on public sharing to get a link and QR you can add to LinkedIn. It shows your username and verified skills only, no personal data.',
      },
      {
        question: 'What does Career goals (Gap Analyzer) do?',
        answer:
          'Pick a target role and VORA maps its required skills onto your progress: a readiness score, a gap list of verified vs missing topics, and one click to add what is missing.',
      },
      {
        question: 'What is the Mistake Coach?',
        answer:
          'After a quiz it reviews the questions you missed and explains why, with hints and curated resources so you can review the right things.',
      },
    ],
  },
  {
    label: 'AI & troubleshooting',
    items: [
      {
        question: 'Why does a feature sometimes say "AI is busy"?',
        answer:
          'AI features degrade gracefully — if the AI service is rate-limited, VORA shows a sensible default instead. The core learning loop (roadmaps, quizzes, progress and streaks) always works without AI.',
      },
      {
        question: 'The first page load is slow — is something wrong?',
        answer:
          'No. After a period of inactivity our server needs a moment to wake up, so the first request can take a little longer. It is quick again right after.',
      },
      {
        question: 'My progress did not update after a quiz.',
        answer:
          'Progress updates when a quiz is graded — 80% or higher completes the section. If a topic shared across roadmaps looks out of sync, refreshing the page usually resolves it.',
      },
    ],
  },
]
