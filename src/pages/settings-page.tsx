import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useMe } from '@/features/profile/hooks/use-profile'
import {
  User,
  Lock,
  Link2,
  Bell,
  Palette,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  ChevronDown,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

// Toggle switch component
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-brand-purple-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// Section card wrapper
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
    <div className="bg-white rounded-2xl border border-border-soft p-6 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-bg-lavender flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-brand-purple-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary">{title}</p>
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { data: me } = useMe()

  // Account settings state
  const [fullName, setFullName] = useState(me?.username ?? '')
  const [email, setEmail] = useState(me?.email ?? '')

  // Password state
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Notification state
  const [notifications, setNotifications] = useState({
    roadmapUpdates: true,
    goalProgress: true,
    learningReminders: true,
    productAnnouncements: false,
    weeklySummary: true,
  })

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  const passwordRules = [
    { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
    { label: 'A number', test: (v: string) => /[0-9]/.test(v) },
    { label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  ]

  const logout = () => {
    setAuth(null, null)
    navigate('/login')
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your account, preferences, and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4">
          {/* Account Settings */}
          <Section
            icon={User}
            title="Account settings"
            subtitle="Update your personal information and account details."
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">Full name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border-input text-sm outline-none focus:border-brand-purple-500 transition"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border-input text-sm outline-none focus:border-brand-purple-500 transition"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-5 py-2 rounded-lg bg-[#003B71] text-white text-sm font-semibold hover:bg-[#082A5E] transition">
                  Save change
                </button>
              </div>
            </div>
          </Section>

          {/* Password & Security */}
          <Section
            icon={Lock}
            title="Password & security"
            subtitle="Keep your account secure by updating your password."
          >
            <div className="flex flex-col gap-3">
              {/* Current password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border-input text-sm outline-none focus:border-brand-purple-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New + Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">New password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border-input text-sm outline-none focus:border-brand-purple-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border-input text-sm outline-none focus:border-brand-purple-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password rules */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-text-muted">Password must include:</p>
                {passwordRules.map((rule) => {
                  const passed = rule.test(newPassword)
                  return (
                    <div key={rule.label} className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${passed ? 'text-green-500' : 'text-text-muted'}`}
                      >
                        {passed ? '✓' : '○'} {rule.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end">
                <button className="px-5 py-2 rounded-lg bg-[#003B71] text-white text-sm font-semibold hover:bg-[#082A5E] transition">
                  Update password
                </button>
              </div>
            </div>
          </Section>

          {/* Connected Accounts */}
          <Section
            icon={Link2}
            title="Connected accounts"
            subtitle="Connect external accounts to enhance your experience."
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGithub className="w-5 h-5 text-text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Github</p>
                    <p className="text-xs text-text-muted">alexd-dev</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-brand-purple-500 hover:underline">
                  Continue
                </button>
              </div>
              <div className="h-px bg-border-soft" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FcGoogle className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Google</p>
                    <p className="text-xs text-text-muted">alex.d@example.com</p>
                  </div>
                </div>
                <button className="text-sm font-semibold text-brand-purple-500 hover:underline">
                  Continue
                </button>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">
          {/* Notification References */}
          <Section
            icon={Bell}
            title="Notification references"
            subtitle="Choose what you want to be notified about."
          >
            <div className="flex flex-col gap-4">
              {[
                {
                  key: 'roadmapUpdates',
                  label: 'Roadmap updates',
                  desc: 'Get notified about changes to roadmaps you follow.',
                },
                {
                  key: 'goalProgress',
                  label: 'Goal progress',
                  desc: 'Receive updates on your goal progress.',
                },
                {
                  key: 'learningReminders',
                  label: 'Learning reminders',
                  desc: 'Get reminded to keep learning and stay on track.',
                },
                {
                  key: 'productAnnouncements',
                  label: 'Product announcements',
                  desc: 'Important updates, new features, and tips.',
                },
                {
                  key: 'weeklySummary',
                  label: 'Weekly summary',
                  desc: 'Receive a weekly summary of your activity.',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={notifications[item.key as keyof typeof notifications]}
                    onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between pt-2 border-t border-border-soft">
                <p className="text-sm font-medium text-text-primary">Email frequency</p>
                <button className="flex items-center gap-2 text-sm text-text-primary border border-border-input rounded-lg px-3 py-1.5 hover:bg-bg-section transition">
                  Instant <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Section>

          {/* Appearance & Language */}
          <Section
            icon={Palette}
            title="Appearance & language"
            subtitle="Customize how VORA looks and works for you."
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-text-primary">Current password</p>
                <div className="flex gap-2">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition ${
                        theme === t
                          ? 'border-brand-purple-500 bg-bg-lavender text-brand-purple-600'
                          : 'border-border-input text-text-secondary hover:bg-bg-section'
                      }`}
                    >
                      {t === 'light' ? '☀' : t === 'dark' ? '🌙' : '🖥'}{' '}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-primary">Language</p>
                <button className="flex items-center gap-2 text-sm text-text-primary border border-border-input rounded-lg px-3 py-1.5 hover:bg-bg-section transition">
                  English (US) <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Section>

          {/* Account Actions */}
          <Section
            icon={LogOut}
            title="Account actions"
            subtitle="Manage your session and account."
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Logout</p>
                  <p className="text-xs text-text-muted">Log out of your account on this device.</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg border border-border-input text-sm font-semibold text-text-primary hover:bg-bg-section transition"
              >
                Log out
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
