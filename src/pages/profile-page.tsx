import {
  BookOpen,
  Flame,
  TrendingUp,
  Clock,
  CheckCircle2,
  HelpCircle,
  Play,
  Trophy,
  Star,
  ExternalLink,
  Pencil,
} from 'lucide-react'
import { useMe, useMyProfile } from '@/features/profile/hooks/use-profile'

// ── Mock data (xóa khi BE ship) ──
const mockRoadmaps = [
  { id: 1, title: 'Frontend Web Development', progress: 58, done: 8, total: 14 },
  { id: 2, title: 'Backend Web Development', progress: 36, done: 5, total: 14 },
  { id: 3, title: 'Fullstack Web Development', progress: 22, done: 3, total: 14 },
]

const mockActivity = [
  {
    icon: CheckCircle2,
    color: 'text-green-500',
    type: 'Completed topic',
    title: 'DOM & Events',
    sub: 'in Frontend Web Development',
    time: '2 days ago',
  },
  {
    icon: HelpCircle,
    color: 'text-brand-purple-400',
    type: 'Quiz completed',
    title: 'JavaScript Basics Quiz',
    sub: 'Score: 92%',
    time: '3 days ago',
  },
  {
    icon: Play,
    color: 'text-blue-400',
    type: 'Started roadmap',
    title: 'Backend Web Development',
    sub: '',
    time: '5 days ago',
  },
  {
    icon: CheckCircle2,
    color: 'text-green-500',
    type: 'Completed topic',
    title: 'HTML & CSS',
    sub: 'in Frontend Web Development',
    time: '1 week ago',
  },
  {
    icon: Trophy,
    color: 'text-yellow-500',
    type: 'Earned achievement',
    title: '7 Day Streak',
    sub: 'Keep it up!',
    time: '1 week ago',
  },
]
// ────────────────────────────────

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
    <div className="flex-1 min-w-0 rounded-xl border border-border-soft bg-white p-4 flex flex-col gap-3">
      {/* Mini roadmap illustration placeholder */}
      <div className="w-full h-24 bg-bg-section rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-xs text-text-muted opacity-60 select-none">
          <div className="flex gap-3">
            <span className="px-2 py-0.5 border border-border-input rounded text-[10px]">
              Frontend
            </span>
          </div>
          <div className="w-px h-3 bg-border-input" />
          <div className="flex gap-3">
            <span className="px-2 py-0.5 border border-border-input rounded text-[10px]">
              Web Fundamentals
            </span>
          </div>
          <div className="flex gap-4">
            <div className="w-px h-3 bg-border-input" />
            <div className="w-px h-3 bg-border-input" />
          </div>
          <div className="flex gap-2">
            <span className="px-1.5 py-0.5 border border-border-input rounded text-[10px]">
              HTML & CSS
            </span>
            <span className="px-1.5 py-0.5 border border-border-input rounded text-[10px]">
              JS Basics
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm font-bold text-text-primary leading-snug">{title}</p>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-border-soft overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-purple-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-text-muted">
        {progress}% complete • {done} of {total} topics
      </p>
    </div>
  )
}

export default function ProfilePage() {
  const { data: me, isLoading: loadingMe } = useMe()
  const { data: profile, isLoading: loadingProfile } = useMyProfile()

  if (loadingMe || loadingProfile) {
    return (
      <div className="flex items-center justify-center h-60">
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
    : 'March 12, 2025'

  return (
    <div className="flex gap-5 items-start">
      {/* ── Left (main) ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Profile</h1>
          <p className="text-sm text-text-muted mt-0.5">Your learning journey at a glance.</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-border-soft p-6 flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-purple-300/30 flex items-center justify-center shrink-0">
            <div className="w-12 h-12 rounded-full bg-brand-purple-300/50 flex items-center justify-center text-brand-purple-600 font-bold text-xl">
              {initials}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-text-primary">{me?.username ?? 'Alex D.'}</h2>
              <span className="px-2.5 py-0.5 rounded-full border border-brand-purple-400 text-xs font-semibold text-brand-purple-600">
                {levelLabel[profile?.level] ?? 'Learner'}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-2">{me?.email ?? 'alex.d@example.com'}</p>
            <p className="text-sm text-text-secondary mb-3">
              Passionate about building intuitive web experiences and continuously leveling up my
              skills.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              Joined {joinedDate}
            </div>
          </div>

          {/* Edit button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-input text-sm font-semibold text-text-primary hover:bg-bg-section transition shrink-0">
            <Pencil className="w-3.5 h-3.5" /> Edit profile
          </button>
        </div>

        {/* Active Roadmaps */}
        <div className="bg-white rounded-2xl border border-border-soft p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-text-primary">Active roadmaps</p>
              <p className="text-xs text-text-muted mt-0.5">Roadmaps you're currently following.</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-brand-purple-500 hover:underline">
              View all roadmaps <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3">
            {mockRoadmaps.map((r) => (
              <RoadmapCard key={r.id} {...r} />
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="bg-white rounded-2xl border border-border-soft p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-text-primary">Keep learning, keep growing!</p>
              <p className="text-xs text-text-muted">
                You're making great progress. Stay consistent and unlock new achievements.
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-brand-purple-500 text-white text-sm font-semibold hover:bg-brand-purple-600 transition shrink-0">
            Explore Roadmaps
          </button>
        </div>
      </div>

      {/* ── Right (stats + activity) ── */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        {/* Learning stats */}
        <div className="bg-white rounded-2xl border border-border-soft p-5 flex flex-col gap-4">
          <p className="text-sm font-bold text-text-primary">Learning stats</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-brand-purple-500">
                <BookOpen className="w-4 h-4" />
                <span className="text-xl font-extrabold text-text-primary">28</span>
              </div>
              <p className="text-xs font-semibold text-text-primary">Topics completed</p>
              <p className="text-xs text-text-muted">Across all roadmaps</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-brand-purple-500">
                <Flame className="w-4 h-4" />
                <span className="text-xl font-extrabold text-text-primary">
                  {profile?.streak ?? 7}
                </span>
              </div>
              <p className="text-xs font-semibold text-text-primary">Day streak</p>
              <p className="text-xs text-text-muted">Keep it going!</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-brand-purple-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xl font-extrabold text-text-primary">87%</span>
              </div>
              <p className="text-xs font-semibold text-text-primary">Quiz average</p>
              <p className="text-xs text-text-muted">Last 30 days</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-brand-purple-500">
                <Clock className="w-4 h-4" />
                <span className="text-xl font-extrabold text-text-primary">32.5</span>
              </div>
              <p className="text-xs font-semibold text-text-primary">Total learning hours</p>
              <p className="text-xs text-text-muted">All time</p>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-border-soft p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-text-primary">Recent activity</p>
            <p className="text-xs text-text-muted mt-0.5">See what you've been up to.</p>
          </div>
          <div className="flex flex-col gap-3">
            {mockActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full bg-bg-section flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted">{item.type}</p>
                  <p className="text-xs font-semibold text-text-primary truncate">{item.title}</p>
                  {item.sub && <p className="text-xs text-text-muted">{item.sub}</p>}
                </div>
                <span className="text-xs text-text-muted shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-brand-purple-500 hover:underline">
            View all activity <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
