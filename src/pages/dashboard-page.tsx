import { ExternalLink, Plus, ChevronRight, BookOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuthStore } from '@/stores/auth-store'

// ── Mock data (xóa khi BE ship) ──
const weeklyData = [
  { day: 'Mon', topics: 3 },
  { day: 'Tue', topics: 7 },
  { day: 'Wed', topics: 8 },
  { day: 'Thu', topics: 9 },
  { day: 'Fri', topics: 5 },
  { day: 'Sat', topics: 1 },
  { day: 'Sun', topics: 2 },
]

const streakDays = [
  { day: 'Mon', date: 'May 12', done: true },
  { day: 'Tue', date: 'May 13', done: true },
  { day: 'Wed', date: 'May 14', done: true },
  { day: 'Thu', date: 'May 15', done: true },
  { day: 'Fri', date: 'May 16', done: true },
  { day: 'Sat', date: 'May 17', done: true },
  { day: 'Sun', date: 'May 18', done: false },
]

const myRoadmaps = [
  { id: 1, title: 'Frontend Web Dev', weeks: '8-10 Weeks', topics: 24, progress: 42, done: false },
  { id: 2, title: 'Backend Web Dev', weeks: '10-12 Weeks', topics: 28, progress: 18, done: false },
  { id: 3, title: 'React Dev Path', weeks: '12-16 Weeks', topics: 36, progress: 65, done: false },
  { id: 4, title: 'Web Foundations', weeks: '4-6 Weeks', topics: 16, progress: 100, done: true },
]
// ────────────────────────────────

// Circular progress ring
function CircleProgress({ percent, size = 80 }: { percent: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  const color = percent === 100 ? '#22C55E' : '#7C3AED'

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-text-primary">{percent}%</span>
    </div>
  )
}

// Stat card (top right)
function StatCard({
  icon,
  label,
  value,
  delta,
  chart,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  delta?: string
  chart?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
          {icon} {label}
        </div>
        {chart && (
          <div className="w-16 h-8 opacity-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData.slice(-4)} barSize={4}>
                <Bar dataKey="topics" fill="#7C3AED" radius={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <p className="text-2xl font-extrabold text-text-primary">{value}</p>
      {delta && <p className="text-xs text-green-500 font-medium">▲ {delta}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.username?.split(' ')[0] ?? 'Alex'

  return (
    <div className="flex gap-5 items-start">
      {/* ── Left column ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">
              Welcome back, {firstName}!
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Pick up where you left off and keep building your skills.
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-input text-sm font-semibold text-text-primary hover:bg-bg-section transition shrink-0">
            Browse all Roadmaps <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-2xl border border-border-soft p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Continue Learning</h2>
          <div className="flex items-center gap-6">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <CircleProgress percent={42} size={96} />
              <p className="text-xs text-text-muted">Complete</p>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-muted mb-1">Current roadmap</p>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-base font-bold text-text-primary">Frontend Web Development</p>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
              </div>
              <div className="w-full h-1.5 rounded-full bg-border-soft overflow-hidden mb-1">
                <div className="h-full w-[42%] rounded-full bg-brand-purple-500" />
              </div>
              <p className="text-xs text-brand-purple-500 font-medium mb-3">42% complete</p>

              <p className="text-xs text-text-muted mb-1">Next up</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-lavender flex items-center justify-center text-sm font-bold text-brand-purple-600 shrink-0">
                  7
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Components & Props</p>
                  <p className="text-xs text-text-muted">7 of 24 topics completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003B71] text-white text-sm font-semibold hover:bg-[#082A5E] transition">
              Continue Learning →
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-input text-sm font-semibold text-text-primary hover:bg-bg-section transition">
              View Roadmap <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* My Roadmaps */}
        <div className="bg-white rounded-2xl border border-border-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">My Roadmaps</h2>
            <button className="flex items-center gap-1 text-sm font-semibold text-brand-purple-500 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {myRoadmaps.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border-soft p-3 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold text-text-primary leading-snug">{r.title}</p>
                  <BookOpen className="w-4 h-4 text-text-muted shrink-0" />
                </div>
                <div className="flex justify-center">
                  <CircleProgress percent={r.progress} size={64} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">{r.weeks}</p>
                  <p className="text-xs text-text-muted">{r.topics} topics</p>
                </div>
                <button
                  className={`w-full py-1.5 rounded-lg border text-xs font-semibold transition ${
                    r.done
                      ? 'border-brand-purple-400 text-brand-purple-600 hover:bg-bg-lavender'
                      : 'border-border-input text-text-primary hover:bg-bg-section'
                  }`}
                >
                  {r.done ? 'Review' : 'Continue'}
                </button>
              </div>
            ))}

            {/* Add another role */}
            <div className="rounded-xl border border-dashed border-border-input p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-bg-section transition col-span-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                <div className="w-6 h-6 rounded-full border-2 border-text-muted flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Add another role
              </div>
              <p className="text-xs text-text-muted">Start a new roadmap</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<span className="text-brand-purple-400">📈</span>}
            label="Roadmap Progress"
            value="42%"
            delta="8% vs last week"
            chart
          />
          <StatCard
            icon={<span className="text-green-500">✓</span>}
            label="Completed Topics"
            value={28}
            delta="5 vs last week"
            chart
          />
          <StatCard
            icon={<span className="text-brand-purple-400">🗓</span>}
            label="Roadmap Progress"
            value="42%"
            delta="Keep it going!"
          />
          <StatCard
            icon={<span className="text-yellow-500">⭐</span>}
            label="Quiz Score (Avg.)"
            value="84%"
            delta="6% vs last week"
            chart
          />
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl border border-border-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text-primary">Weekly Progress</p>
            <button className="text-xs text-text-muted border border-border-input rounded-lg px-2.5 py-1 flex items-center gap-1">
              This week <span>▾</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData} barSize={18}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 10]}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                cursor={{ fill: '#F7F4FF' }}
              />
              <Bar dataKey="topics" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-sm bg-brand-purple-500" />
            <span className="text-xs text-text-muted">Topics Completed</span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-2xl border border-border-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-text-primary">Learning Streak</p>
            <span className="text-xs text-text-muted flex items-center gap-1">This week 🔥</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {streakDays.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <p className="text-xs text-text-muted">{d.day}</p>
                <p className="text-[10px] text-text-muted">{d.date.split(' ')[1]}</p>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    d.done
                      ? 'bg-brand-purple-500 text-white'
                      : 'border-2 border-border-input text-text-muted'
                  }`}
                >
                  {d.done ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
