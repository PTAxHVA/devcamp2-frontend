import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { RiFileList2Line, RiPlayCircleLine, RiStarLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { SHADOW_CARD } from '../lib/landing-styles'

/** Browser-window chrome (traffic lights + url bar) wrapping a step's mock UI. */
const BrowserFrame = ({ children }: { children: ReactNode }) => (
  <div
    className={cn('border-border-soft overflow-hidden rounded-[14px] border bg-white', SHADOW_CARD)}
  >
    <div
      aria-hidden
      className="border-border-soft bg-bg-section flex items-center gap-2 border-b px-3 py-[9px]"
    >
      <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
      <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      <span className="border-border-soft ml-1.5 h-4 flex-1 rounded-[5px] border bg-white" />
    </div>
    <div className="p-[18px]">{children}</div>
  </div>
)

const MockOption = ({ selected, children }: { selected?: boolean; children: ReactNode }) => (
  <div
    className={cn(
      'mb-2 flex items-center gap-2.5 rounded-[10px] border px-3 py-[9px] text-[0.85rem]',
      selected
        ? 'border-brand-purple-400 bg-bg-lavender'
        : 'border-border-soft text-text-secondary',
    )}
  >
    <span
      aria-hidden
      className={cn(
        'h-4 w-4 shrink-0 rounded-full border-2',
        selected
          ? 'border-brand-purple-500 shadow-[inset_0_0_0_3px_#fff,inset_0_0_0_5px_#7c3aed]'
          : 'border-border-input',
      )}
    />
    {children}
  </div>
)

const HNode = ({ variant, children }: { variant?: 'done' | 'cur'; children: ReactNode }) => (
  <span
    className={cn(
      'rounded-[9px] border-[1.5px] px-2.5 py-[7px] text-[0.72rem] font-bold',
      variant === 'done' && 'border-brand-navy-900 bg-brand-navy-900 text-white',
      variant === 'cur' && 'border-brand-purple-500 bg-bg-lavender text-brand-purple-700',
      !variant && 'border-border-input text-text-muted bg-white',
    )}
  >
    {children}
  </span>
)

const Arrow = () => (
  <span aria-hidden className="text-border-input font-bold">
    →
  </span>
)

const Resource = ({ icon: Icon, title, meta }: { icon: IconType; title: string; meta: string }) => (
  <div className="border-border-soft mb-2 flex items-center gap-2.5 rounded-[10px] border px-3 py-[9px]">
    <span
      aria-hidden
      className="bg-bg-lavender text-brand-purple-600 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
    >
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <b className="text-text-primary block text-[0.84rem]">{title}</b>
      <small className="text-text-muted text-[0.72rem]">{meta}</small>
    </div>
  </div>
)

export const WizardFrame = () => (
  <BrowserFrame>
    <div className="text-text-primary mb-3 text-[0.86rem] font-bold">
      What role are you aiming for?
    </div>
    <MockOption selected>Frontend Developer</MockOption>
    <MockOption>Backend Developer</MockOption>
    <MockOption>Full-stack Developer</MockOption>
    <div className="bg-bg-section mt-3 h-1.5 overflow-hidden rounded-md">
      <div className="bg-brand-purple-500 h-full w-2/5 rounded-md" />
    </div>
    <div className="text-text-muted mt-2 text-[0.72rem]">Step 2 of 5</div>
  </BrowserFrame>
)

export const RoadmapPathFrame = () => (
  <BrowserFrame>
    <div className="flex flex-wrap items-center gap-2">
      <HNode variant="done">HTML</HNode>
      <Arrow />
      <HNode variant="done">CSS</HNode>
      <Arrow />
      <HNode variant="cur">JavaScript</HNode>
      <Arrow />
      <HNode>React</HNode>
      <Arrow />
      <HNode>Project</HNode>
    </div>
    <div className="text-text-muted mt-3.5 text-[0.72rem]">
      Personalized order · 6 topics · ~48 hrs
    </div>
  </BrowserFrame>
)

export const ResourceListFrame = () => (
  <BrowserFrame>
    <Resource icon={RiFileList2Line} title="MDN — Array methods" meta="Documentation · 15 min" />
    <Resource icon={RiPlayCircleLine} title="freeCodeCamp — JS Basics" meta="Video · 22 min" />
    <Resource icon={RiStarLine} title="Practice — Build a to-do app" meta="Project · ~2 hrs" />
  </BrowserFrame>
)

export const QuizDonutFrame = () => (
  <BrowserFrame>
    <div className="flex flex-wrap items-center gap-[18px]">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 36 36" className="h-24 w-24" aria-hidden>
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ebe4ff" strokeWidth="3.4" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray="78 100"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <span className="text-text-primary absolute inset-0 grid place-items-center text-[1.3rem] font-extrabold">
          80%
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="font-secondary bg-bg-lavender text-brand-purple-700 mb-2 inline-block rounded-[7px] px-2.5 py-1 text-[0.66rem] font-bold tracking-[0.08em] uppercase">
          Passed · 4 / 5 correct
        </span>
        <b className="text-text-primary block text-[1rem]">JavaScript quiz cleared</b>
        <small className="text-text-muted text-[0.85rem]">
          Section verified — React is now unlocked.
        </small>
      </div>
    </div>
  </BrowserFrame>
)
