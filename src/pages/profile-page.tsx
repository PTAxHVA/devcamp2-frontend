import { useNavigate } from 'react-router'
import { BookOpen, Flame, Clock, Star, ExternalLink, Pencil } from 'lucide-react'
import { useMe, useMyProfile, useMyProgress } from '@/features/profile/hooks/use-profile'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'

const levelLabel: Record<string, string> = {
  beginner: 'Learner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

function RoadmapCard({
  title,
  progress,
  done,
  total,
}: {
  title: string
  progress: number
  done: number
  total: number
}) {
  return (
    <div className="border-border-soft flex min-w-0 flex-1 flex-col gap-3 rounded-xl border bg-white p-4">
      {/* Abstract roadmap illustration — shows the real roadmap title, no fabricated topic names */}
      <div className="bg-bg-section flex h-24 w-full items-center justify-center rounded-lg">
        <div className="text-text-muted flex flex-col items-center gap-1.5 opacity-60 select-none">
          <span className="border-border-input max-w-[9rem] truncate rounded border px-2 py-0.5 text-[10px]">
            {title}
          </span>
          <div className="bg-border-input h-3 w-px" />
          <div className="flex gap-4">
            <div className="bg-border-input h-3 w-px" />
            <div className="bg-border-input h-3 w-px" />
          </div>
          <div className="flex gap-2">
            <span className="bg-border-input h-2 w-10 rounded" />
            <span className="bg-border-input h-2 w-10 rounded" />
          </div>
        </div>
      </div>

      <p className="text-text-primary text-sm leading-snug font-bold">{title}</p>

      {/* Progress bar */}
      <div className="bg-border-soft h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-brand-purple-500 h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-text-muted text-xs">
        {progress}% complete • {done} of {total} sections
      </p>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: me, isLoading: loadingMe } = useMe()
  const { data: profile, isLoading: loadingProfile } = useMyProfile()
  const { data: roadmapsData, isLoading: loadingRoadmaps } = useMyRoadmaps()
  const { data: progressData, isLoading: loadingProgress } = useMyProgress()

  const activeRoadmaps = (roadmapsData ?? []).map((r) => {
    const prog = (progressData ?? []).find((p) => p.roadmapId === r.roadmapId)
    return {
      id: r._id,
      title: r.roleName ?? 'Personal Roadmap',
      progress: prog ? Math.round(prog.roadmapCompletionPercentage) : 0,
      done: prog?.totalCompletedSections ?? 0,
      total: prog?.totalSections ?? 0,
    }
  })

  const sectionsCompleted = (progressData ?? []).reduce(
    (sum, p) => sum + (p.totalCompletedSections ?? 0),
    0,
  )

  if (loadingMe || loadingProfile || loadingRoadmaps || loadingProgress) {
    return (
      <div className="flex h-60 items-center justify-center">
        <span className="loading loading-spinner loading-md text-brand-purple-500" />
      </div>
    )
  }

  const initials = me?.username?.slice(0, 2).toUpperCase() ?? 'U'
  const joinedDate = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <div className="flex items-start gap-5">
      {/* ── Left (main) ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="text-text-primary text-2xl font-extrabold">Profile</h1>
          <p className="text-text-muted mt-0.5 text-sm">Your learning journey at a glance.</p>
        </div>

        {/* Profile card */}
        <div className="border-border-soft flex items-start gap-5 rounded-2xl border bg-white p-6">
          {/* Avatar */}
          <div className="bg-brand-purple-300/30 flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
            <div className="bg-brand-purple-300/50 text-brand-purple-600 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
              {initials}
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-text-primary text-xl font-bold">{me?.username ?? ''}</h2>
              <span className="border-brand-purple-400 text-brand-purple-600 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {levelLabel[profile?.level?.toLowerCase()] ?? 'Learner'}
              </span>
            </div>
            <p className="text-text-muted mb-3 text-sm">{me?.email ?? ''}</p>
            <div className="text-text-muted flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5" />
              Joined {joinedDate}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => navigate('/settings')}
            className="border-border-input text-text-primary hover:bg-bg-section flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit profile
          </button>
        </div>

        {/* Active Roadmaps */}
        <div className="border-border-soft flex flex-col gap-4 rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-bold">Active roadmaps</p>
              <p className="text-text-muted mt-0.5 text-xs">Roadmaps you're currently following.</p>
            </div>
            <button
              onClick={() => navigate('/my-learning')}
              className="text-brand-purple-500 flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              View all roadmaps <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-3">
            {activeRoadmaps.length > 0 ? (
              activeRoadmaps.map((r) => <RoadmapCard key={r.id} {...r} />)
            ) : (
              <p className="text-text-muted text-sm">No active roadmaps yet.</p>
            )}
          </div>
        </div>

        {/* Banner */}
        <div className="border-border-soft flex items-center justify-between gap-4 rounded-2xl border bg-white p-5">
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 shrink-0 text-yellow-400" />
            <div>
              <p className="text-text-primary text-sm font-bold">Keep learning, keep growing!</p>
              <p className="text-text-muted text-xs">
                You're making great progress. Stay consistent and unlock new achievements.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/roadmaps/browse')}
            className="bg-brand-purple-500 hover:bg-brand-purple-600 shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            Explore Roadmaps
          </button>
        </div>
      </div>

      {/* ── Right (stats + activity) ── */}
      <div className="flex w-72 shrink-0 flex-col gap-4">
        {/* Learning stats */}
        <div className="border-border-soft flex flex-col gap-4 rounded-2xl border bg-white p-5">
          <p className="text-text-primary text-sm font-bold">Learning stats</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-brand-purple-500 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span className="text-text-primary text-xl font-extrabold">
                  {sectionsCompleted}
                </span>
              </div>
              <p className="text-text-primary text-xs font-semibold">Sections completed</p>
              <p className="text-text-muted text-xs">Across all roadmaps</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-brand-purple-500 flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                <span className="text-text-primary text-xl font-extrabold">
                  {profile?.streak ?? 0}
                </span>
              </div>
              <p className="text-text-primary text-xs font-semibold">Day streak</p>
              <p className="text-text-muted text-xs">Keep it going!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
