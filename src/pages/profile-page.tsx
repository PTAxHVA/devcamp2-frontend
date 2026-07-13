import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Clock, Star, ExternalLink, Pencil } from 'lucide-react'
import { useMe, useMyProfile, useMyProgress } from '@/features/profile/hooks/use-profile'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'
import { UserAvatar } from '@/components/shared/user-avatar'
import { ActiveRoadmapCard } from '@/features/profile/components/active-roadmap-card'
import { ProfileStatsPanel } from '@/features/profile/components/profile-stats-panel'
import { ProfileActivityCard } from '@/features/profile/components/profile-activity-card'
import { EditProfileModal } from '@/features/profile/components/edit-profile-modal'

const levelLabel: Record<string, string> = {
  beginner: 'Learner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
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

  if (loadingMe || loadingProfile || loadingRoadmaps || loadingProgress) {
    return (
      <div className="flex h-60 items-center justify-center">
        <span className="loading loading-spinner loading-md text-brand-purple-500" />
      </div>
    )
  }

  const joinedDate = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8">
      <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-start">
        {/* ── Left (main) ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <h1 className="text-text-primary text-2xl font-extrabold">Profile</h1>
            <p className="text-text-muted mt-0.5 text-sm">Your learning journey at a glance.</p>
          </div>

          {/* Profile card */}
          <div className="border-border-soft bg-bg-card flex flex-wrap items-start gap-5 rounded-2xl border p-6">
            <UserAvatar src={me?.avatarUrl} name={me?.username} className="h-20 w-20" />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-text-primary min-w-0 truncate text-xl font-bold">
                  {me?.username ?? ''}
                </h2>
                <span className="border-brand-purple-400 text-brand-purple-600 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {levelLabel[profile?.level?.toLowerCase()] ?? 'Learner'}
                </span>
              </div>
              <p className="text-text-muted mb-3 truncate text-sm">{me?.email ?? ''}</p>
              <div className="text-text-muted flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" />
                Joined {joinedDate}
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit profile
            </button>
          </div>

          {/* Active Roadmaps */}
          <div className="border-border-soft bg-bg-card flex flex-col gap-4 rounded-2xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary text-sm font-bold">Active roadmaps</p>
                <p className="text-text-muted mt-0.5 text-xs">
                  Roadmaps you're currently following.
                </p>
              </div>
              <button
                onClick={() => navigate('/my-learning')}
                className="text-brand-purple-500 hover:text-brand-purple-700 focus-visible:ring-brand-purple-300 flex items-center gap-1 text-xs font-semibold transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                View all roadmaps <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {activeRoadmaps.length > 0 ? (
                activeRoadmaps.map((r) => <ActiveRoadmapCard key={r.id} {...r} />)
              ) : (
                <p className="text-text-muted text-sm">No active roadmaps yet.</p>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="border-border-soft bg-bg-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
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
              className="bg-brand-purple-500 hover:bg-brand-purple-600 focus-visible:ring-brand-purple-300 shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              Explore Roadmaps
            </button>
          </div>
        </div>

        {/* ── Right (stats) ── */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
          <ProfileStatsPanel />
        </div>
      </div>

      {/* Full-width activity chart (same bars+line as the dashboard's View full) */}
      <ProfileActivityCard />

      {editing && (
        <EditProfileModal
          initialName={me?.username ?? ''}
          initialAvatar={me?.avatarUrl ?? null}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
