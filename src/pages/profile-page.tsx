import { useState } from 'react'
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Flame,
  TrendingUp,
  Clock,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import { useMe, useMyProfile } from '@/features/profile/hooks/use-profile'

// Fix: thêm cả key chữ hoa lẫn chữ thường để handle BE trả 'BEGINNER' hoặc 'beginner'
const levelLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="border-border-soft flex flex-col gap-5 rounded-2xl border bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="bg-bg-lavender flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-brand-purple-500 h-4 w-4" />
        </div>
        <div>
          <p className="text-text-primary text-sm font-bold">{title}</p>
          <p className="text-text-muted mt-0.5 text-xs">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
}: {
  icon: React.ElementType
  value: string | number | null
  label: string
  sub: string
}) {
  return (
    <div className="border-border-soft flex flex-col gap-2 rounded-2xl border bg-white p-5">
      <div className="flex items-center gap-2">
        <Icon className="text-brand-purple-500 h-4 w-4" />
        <span className="text-text-primary text-2xl font-extrabold">{value ?? '—'}</span>
      </div>
      <p className="text-text-primary text-xs font-semibold">{label}</p>
      <p className="text-text-muted text-xs">{sub}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { data: me, isLoading: loadingMe } = useMe()
  const { data: profile, isLoading: loadingProfile } = useMyProfile()

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [level, setLevel] = useState('')

  const initials = me?.username?.slice(0, 2).toUpperCase() ?? 'U'
  const joinedDate = me?.createdAt
    ? new Date(me.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  // Fix: normalize level về lowercase để map đúng
  const normalizedLevel = profile?.level?.toLowerCase() ?? ''
  const displayLevel = levelLabel[normalizedLevel] ?? '—'

  const handleEdit = () => {
    setUsername(me?.username ?? '')
    setLevel(normalizedLevel || 'beginner')
    setEditing(true)
  }

  const handleCancel = () => setEditing(false)

  const handleSave = () => {
    // TODO: wire PATCH /me/profile khi Yoshio ship
    setEditing(false)
  }

  if (loadingMe || loadingProfile) {
    return (
      <div className="flex h-60 items-center justify-center">
        <span className="loading loading-spinner loading-md text-brand-purple-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-text-primary text-2xl font-extrabold">Profile</h1>
        <p className="text-text-muted mt-1 text-sm">View and manage your personal information.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ── Left ── */}
        <div className="flex flex-col gap-4">
          <Section icon={User} title="Personal information" subtitle="Your public profile details.">
            <div className="flex items-center gap-4">
              <div className="bg-brand-purple-400 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-primary text-base font-bold">{me?.username ?? '—'}</p>
                {displayLevel !== '—' && (
                  <span className="border-brand-purple-400 text-brand-purple-600 mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {displayLevel}
                  </span>
                )}
              </div>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="border-border-input text-text-primary hover:bg-bg-section flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              )}
            </div>

            {editing && (
              <div className="border-border-soft flex flex-col gap-3 border-t pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary text-xs font-semibold">Full name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition outline-none"
                    />
                    <User className="text-text-muted absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary text-xs font-semibold">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition outline-none"
                  >
                    {levelOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="border-border-input text-text-primary hover:bg-bg-section flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold transition"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-lg bg-[#003B71] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#082A5E]"
                  >
                    <Check className="h-3.5 w-3.5" /> Save changes
                  </button>
                </div>
              </div>
            )}

            {!editing && (
              <div className="border-border-soft flex flex-col gap-3 border-t pt-2">
                <div className="flex items-center gap-3">
                  <Mail className="text-text-muted h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-text-muted text-xs">Email</p>
                    <p className="text-text-primary text-sm font-medium">{me?.email ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-text-muted h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-text-muted text-xs">Joined</p>
                    <p className="text-text-primary text-sm font-medium">{joinedDate}</p>
                  </div>
                </div>
              </div>
            )}
          </Section>

          <Section icon={Pencil} title="Bio" subtitle="Tell others a little about yourself.">
            <textarea
              rows={3}
              placeholder="Write a short bio..."
              className="border-border-input focus:border-brand-purple-500 text-text-primary placeholder:text-text-muted w-full resize-none rounded-lg border px-4 py-2.5 text-sm transition outline-none"
            />
            <div className="flex justify-end">
              <button className="rounded-lg bg-[#003B71] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#082A5E]">
                Save bio
              </button>
            </div>
          </Section>
        </div>

        {/* ── Right ── */}
        <div className="flex flex-col gap-4">
          {/* Learning stats — chỉ hiện streak thật từ BE, còn lại chờ endpoint */}
          <div className="border-border-soft flex flex-col gap-4 rounded-2xl border bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="bg-bg-lavender flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <TrendingUp className="text-brand-purple-500 h-4 w-4" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-bold">Learning stats</p>
                <p className="text-text-muted mt-0.5 text-xs">Your progress at a glance.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Streak — lấy từ BE */}
              <StatCard
                icon={Flame}
                value={profile?.streak ?? null}
                label="Day streak"
                sub="Keep it going!"
              />
              {/* Topics completed — chờ /me/progress */}
              <StatCard
                icon={BookOpen}
                value={null}
                label="Topics completed"
                sub="Available soon"
              />
              {/* Quiz avg — chờ /dashboard */}
              <StatCard icon={TrendingUp} value={null} label="Quiz average" sub="Available soon" />
              {/* Learning hours — chờ /dashboard */}
              <StatCard
                icon={Clock}
                value={null}
                label="Total learning hours"
                sub="Available soon"
              />
            </div>
          </div>

          <Section icon={User} title="Account status" subtitle="Your current account information.">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-text-primary text-sm">Account status</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    me?.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {me?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="bg-border-soft h-px" />
              <div className="flex items-center justify-between">
                <p className="text-text-primary text-sm">Onboarding</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    me?.onboardingCompleted
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}
                >
                  {me?.onboardingCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
