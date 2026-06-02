import React from 'react'
import type { IconType } from 'react-icons'
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiListUnordered,
  RiFileList2Line,
  RiBarChart2Line,
  RiStarLine,
  RiCheckboxCircleLine,
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
  RiDraggable,
  RiQuestionLine,
  RiBookOpenLine,
  RiFocus3Line,
  RiTimeLine,
  RiExternalLinkLine,
} from 'react-icons/ri'

import { SectionDetailComponent } from './section-detail-component'
import { topic, type Status } from './section-topic-data'

/* --------------------------- Vòng tròn % ---------------------------- */
interface CircularProgressProps {
  value: number
  size?: number
  stroke?: number
}

const CircularProgress = ({ value, size = 84, stroke = 8 }: CircularProgressProps) => {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#ede9fe"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-slate-800">
        {value}%
      </span>
    </div>
  )
}

/* ------------------------- Badge & icon trạng thái ------------------------- */
const statusStyles: Record<Status, string> = {
  Completed: 'bg-emerald-50 text-emerald-600',
  'In Progress': 'bg-indigo-50 text-indigo-600',
  'Not Started': 'bg-slate-100 text-slate-500',
}

const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={`inline-flex justify-center rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status}
  </span>
)

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === 'Completed') return <RiCheckboxCircleFill className="h-5 w-5 text-emerald-500" />
  if (status === 'In Progress')
    return <span className="block h-5 w-5 rounded-full border-2 border-dashed border-indigo-400" />
  return <RiCheckboxBlankCircleLine className="h-5 w-5 text-slate-300" />
}

/* --------------------------------- Card ---------------------------------- */
interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = ({ className = '', children }: CardProps) => (
  <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>
)

interface StatRowProps {
  icon: IconType
  label: string
  value: string | number
}

const StatRow = ({ icon: Icon, label, value }: StatRowProps) => (
  <div className="flex items-center justify-between py-2.5">
    <div className="flex items-center gap-3 text-slate-500">
      <Icon className="h-4.5 w-4.5" />
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
)

/* ================================ TRANG HIỂN THỊ ================================== */
export default function SectionDetailPage() {
  const s = topic.summary
  const cols = 'grid-cols-[20px_22px_1fr_72px_104px_24px]'

  return (
    <SectionDetailComponent>
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-360">
          {/* Back */}
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
            <RiArrowLeftLine className="h-4 w-4" />
            Back to Frontend Web Development
          </button>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            {/* ============================ MAIN ============================ */}
            <main className="flex-1 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700">
                  {topic.index}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-800">{topic.title}</h1>
                    <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                      {topic.tag}
                    </span>
                  </div>
                  {/* Progress */}
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">Progress</span>
                    <div className="h-2 w-full max-w-75 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-700"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                    <span className="whitespace-nowrap text-sm text-slate-500">
                      {topic.progress}% complete
                    </span>
                  </div>
                </div>
              </div>

              <p className="max-w-3xl leading-relaxed text-slate-600">{topic.description}</p>

              {/* Objectives + Prerequisites */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <RiFocus3Line className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-800">Learning objectives</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {topic.objectives.map((o) => (
                      <li key={o} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <RiBookOpenLine className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-800">Prerequisites</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Resources */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold text-slate-800">Resources</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {topic.resources.map((r) => {
                    const Icon = r.icon
                    return (
                      <button
                        key={r.title}
                        className="flex min-h-31 flex-col justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-300 hover:shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">{r.type}</p>
                            <p className="text-sm font-semibold leading-snug text-slate-800">
                              {r.title}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                          {r.meta}
                          {r.external && <RiExternalLinkLine className="h-3.5 w-3.5" />}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Sections */}
              <Card className="p-6">
                <h3 className="mb-3 font-semibold text-slate-800">Sections</h3>
                <div
                  className={`grid ${cols} items-center gap-4 px-2 pb-1 text-xs font-medium text-slate-400`}
                >
                  <span />
                  <span>#</span>
                  <span>Section</span>
                  <span>Duration</span>
                  <span className="text-center">Status</span>
                  <span />
                </div>
                {topic.sections.map((sec) => (
                  <div
                    key={sec.n}
                    className={`grid ${cols} items-center gap-4 border-t border-slate-100 px-2 py-4 transition hover:bg-slate-50/60`}
                  >
                    <RiDraggable className="h-4 w-4 cursor-grab text-slate-300" />
                    <span className="text-sm text-slate-400">{sec.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sec.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{sec.desc}</p>
                    </div>
                    <span className="text-sm text-slate-500">{sec.duration}</span>
                    <StatusBadge status={sec.status} />
                    <StatusIcon status={sec.status} />
                  </div>
                ))}
              </Card>
            </main>

            {/* ============================ RAIL ============================ */}
            <aside className="w-full shrink-0 space-y-5 lg:w-90">
              {/* Topic summary */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold text-slate-800">Topic summary</h3>

                <div className="flex items-center gap-4">
                  <CircularProgress value={topic.progress} />
                  <div>
                    <p className="font-semibold text-slate-800">Your progress</p>
                    <p className="text-sm text-slate-500">
                      {s.completed} of {s.sections} sections completed
                    </p>
                    <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-purple-600"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="my-5 border-t border-slate-100" />

                <div className="divide-y divide-slate-50">
                  <StatRow icon={RiTimeLine} label="Estimated time" value={s.estimatedTime} />
                  <StatRow icon={RiListUnordered} label="Sections" value={s.sections} />
                  <StatRow icon={RiFileList2Line} label="Resources" value={s.resources} />
                  <StatRow icon={RiBarChart2Line} label="Difficulty" value={s.difficulty} />
                  <StatRow icon={RiStarLine} label="Importance" value={s.importance} />
                </div>

                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e1b4b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#2a2566]">
                  Continue topic <RiArrowRightLine className="h-4 w-4" />
                </button>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Mark as complete <RiCheckboxCircleLine className="h-4 w-4" />
                </button>
              </Card>

              {/* Up next */}
              <Card className="cursor-pointer p-5 transition hover:border-purple-200">
                <p className="mb-3 text-sm font-semibold text-slate-700">Up next in this roadmap</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                    {topic.upNext.index}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{topic.upNext.title}</p>
                    <p className="text-xs text-slate-400">Estimated time: {topic.upNext.time}</p>
                  </div>
                  <RiArrowRightSLine className="h-5 w-5 text-slate-400" />
                </div>
              </Card>

              {/* Need help */}
              <Card className="cursor-pointer p-5 transition hover:border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <RiQuestionLine className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Need help?</p>
                    <p className="text-xs text-slate-400">Ask AI Assistant about this topic</p>
                  </div>
                  <RiArrowRightSLine className="h-5 w-5 text-slate-400" />
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </SectionDetailComponent>
  )
}
