import type { ReactNode } from 'react'
import { BookOpen, CheckCircle2, Target, Flame } from 'lucide-react'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { useMyProgress } from '../hooks/use-profile'
import { formatStatValue } from './profile-stats-panel.utils'

function StatTile({
  icon,
  value,
  label,
  sub,
}: {
  icon: ReactNode
  value: string
  label: string
  sub: string
}) {
  return (
    <div className="border-border-soft flex flex-col gap-1.5 rounded-xl border p-3.5">
      <span className="text-brand-purple-500">{icon}</span>
      <span className="text-text-primary text-xl leading-none font-extrabold">{value}</span>
      <span className="text-text-primary text-xs font-semibold">{label}</span>
      <span className="text-text-muted text-[11px]">{sub}</span>
    </div>
  )
}

/**
 * Rich learning-stats panel for the profile page. Reuses the dashboard query
 * (completed topics, quiz average, current/longest streak, overall progress) +
 * the progress query (sections completed) — no dedicated backend.
 */
export function ProfileStatsPanel() {
  const { data: dashboard } = useDashboard()
  const { data: progress } = useMyProgress()

  const sectionsDone = (progress ?? []).reduce((sum, p) => sum + (p.totalCompletedSections ?? 0), 0)
  const totalSections = (progress ?? []).reduce((sum, p) => sum + (p.totalSections ?? 0), 0)
  const overall = dashboard?.stats.roadmapProgress ?? 0

  return (
    <div className="border-border-soft bg-bg-card flex flex-col gap-4 rounded-2xl border p-5">
      <p className="text-text-primary text-sm font-bold">Learning stats</p>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-text-primary text-xs font-semibold">Overall progress</span>
          <span className="text-brand-purple-600 text-xs font-extrabold">{overall}%</span>
        </div>
        <div className="bg-border-soft h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-brand-purple-500 h-full rounded-full"
            style={{ width: `${overall}%` }}
          />
        </div>
        <p className="text-text-muted mt-1.5 text-xs">
          {sectionsDone} of {totalSections} sections completed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={<BookOpen className="h-4 w-4" />}
          value={String(sectionsDone)}
          label="Sections done"
          sub="Across all roadmaps"
        />
        <StatTile
          icon={<CheckCircle2 className="h-4 w-4" />}
          value={formatStatValue(dashboard?.stats.completedTopics)}
          label="Topics mastered"
          sub="Quiz-verified"
        />
        <StatTile
          icon={<Target className="h-4 w-4" />}
          value={formatStatValue(dashboard?.stats.quizAvg, '%')}
          label="Quiz average"
          sub="Best per quiz"
        />
        <StatTile
          icon={<Flame className="h-4 w-4" />}
          value={String(dashboard?.streak.currentStreak ?? 0)}
          label="Current streak"
          sub={`Longest: ${dashboard?.streak.longestStreak ?? 0} days`}
        />
      </div>
    </div>
  )
}
