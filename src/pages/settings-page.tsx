import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { queryClient } from '@/lib/query-client'
import {
  useMe,
  useUpdateProfile,
  useUpdateAccount,
  useDeactivateAccount,
} from '@/features/profile/hooks/use-profile'
import { PassportSettingsCard } from '@/features/passport/components/passport-settings-card'
import { User, Lock, LogOut, Eye, EyeOff, Mail, X } from 'lucide-react'

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
    <div className="border-border-soft bg-bg-card flex flex-col gap-5 rounded-2xl border p-6">
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

export default function SettingsPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { data: me } = useMe()
  const updateProfile = useUpdateProfile()
  const updateAccount = useUpdateAccount()
  const deactivateAccount = useDeactivateAccount()

  // Account settings state
  const [fullName, setFullName] = useState(me?.username ?? '')
  const [email, setEmail] = useState(me?.email ?? '')
  const [hydrated, setHydrated] = useState(false)
  const [showDeactivatePassword, setShowDeactivatePassword] = useState(false)
  const [deactivatePassword, setDeactivatePassword] = useState('')
  const [showConfirmDeactivatePassword, setShowConfirmDeactivatePassword] = useState(false)

  const deactivateModalRef = useRef<HTMLDivElement>(null)

  const closeDeactivateModal = () => {
    setShowDeactivatePassword(false)
    setDeactivatePassword('')
    setShowConfirmDeactivatePassword(false)
  }

  useEffect(() => {
    if (!showDeactivatePassword) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDeactivateModal()
        return
      }
      // Trap Tab inside the modal — without this, tabbing walks into the page
      // behind the overlay.
      if (e.key !== 'Tab') return
      const modal = deactivateModalRef.current
      if (!modal) return
      const focusables = modal.querySelectorAll<HTMLElement>(
        'button, input, a[href], select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (!modal.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showDeactivatePassword])

  // Populate fields once the current user has loaded (render-phase reset)
  if (!hydrated && me) {
    setHydrated(true)
    setFullName(me.username ?? '')
    setEmail(me.email ?? '')
  }

  // Password state
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Mirror the backend strongPassword policy (signup/reset/account change) so the
  // checklist can't imply rules the API rejects.
  const passwordRules = [
    { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
    { label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
    { label: 'A lowercase letter', test: (v: string) => /[a-z]/.test(v) },
    { label: 'A number', test: (v: string) => /[0-9]/.test(v) },
    { label: 'A special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  ]

  const logout = () => {
    setAuth(null, null)
    // Clear the previous user's cached queries before returning to login.
    queryClient.clear()
    navigate('/login')
  }

  const handleSaveProfile = () => {
    const name = fullName.trim()
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    updateProfile.mutate(
      { username: name },
      {
        onSuccess: () => toast.success('Profile updated'),
        onError: (err) => {
          const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
          toast.error(msg ?? 'Could not update profile')
        },
      },
    )
  }

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast.error('Enter your current password')
      return
    }
    if (!passwordRules.every((rule) => rule.test(newPassword))) {
      toast.error('New password does not meet all the requirements')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    updateAccount.mutate(
      { currentPassword, password: newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated')
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
          toast.error(msg ?? 'Could not update password')
        },
      },
    )
  }

  const handleDeactivateAccount = () => {
    if (!deactivatePassword) {
      toast.error('Enter your password to confirm')
      return
    }
    deactivateAccount.mutate(
      { currentPassword: deactivatePassword },
      {
        onSuccess: () => {
          toast.success('Account deactivated')
          closeDeactivateModal()
          logout()
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
          toast.error(msg ?? 'Could not deactivate account')
        },
      },
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-text-primary text-2xl font-extrabold">Settings</h1>
        <p className="text-text-muted mt-1 text-sm">Manage your account details and security.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                <label className="text-text-primary text-xs font-semibold">Full name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none"
                  />
                  <User className="text-text-muted absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary text-xs font-semibold">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="border-border-input bg-bg-section text-text-muted w-full cursor-not-allowed rounded-lg border px-4 py-2.5 pr-10 text-sm outline-none"
                  />
                  <Mail className="text-text-muted absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                </div>
                <p className="text-text-muted text-xs">Email address can't be changed yet.</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending}
                  className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save changes'}
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
                <label className="text-text-primary text-xs font-semibold">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New + Confirm */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary text-xs font-semibold">New password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-primary text-xs font-semibold">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password rules */}
              <div className="flex flex-col gap-1">
                <p className="text-text-muted text-xs">Password must include:</p>
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
                <button
                  onClick={handleUpdatePassword}
                  disabled={updateAccount.isPending}
                  className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
                >
                  {updateAccount.isPending ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-4">
          {/* Verified Skill Passport sharing */}
          <PassportSettingsCard />

          {/* Account Actions */}
          <Section icon={LogOut} title="Account actions" subtitle="Sign out of your VORA session.">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-bg-section flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <LogOut className="text-text-muted h-4 w-4" />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Log out</p>
                  <p className="text-text-muted text-xs">Sign out of VORA on this device.</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
              >
                Log out
              </button>
            </div>
          </Section>

          {/* Account Deactivation */}
          <Section
            icon={User}
            title="Account deactivation"
            subtitle="Turn off access to your VORA account."
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-bg-section flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <User className="text-text-muted h-4 w-4" />
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">Deactivate account</p>
                  <p className="text-text-muted text-xs">
                    You'll be signed out and can't sign in until reactivated.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeactivatePassword(true)}
                className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-200 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none"
              >
                Deactivate account
              </button>
            </div>
          </Section>
        </div>
      </div>

      {showDeactivatePassword && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200"
          onClick={closeDeactivateModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={deactivateModalRef}
            className="animate-in zoom-in-95 bg-bg-card relative w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-xl duration-200 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDeactivateModal}
              aria-label="Close"
              className="text-text-placeholder hover:bg-bg-section hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <X size={20} />
            </button>

            <h3 className="text-text-primary text-lg font-bold">Deactivate account</h3>
            <p className="text-text-muted mt-2 text-sm leading-relaxed">
              Are you sure you want to deactivate your account? This action will deactivate your
              profile and log you out. To confirm, please enter your password.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleDeactivateAccount()
              }}
            >
              <div className="mt-4 flex flex-col gap-1.5">
                <label className="text-text-primary text-xs font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showConfirmDeactivatePassword ? 'text' : 'password'}
                    value={deactivatePassword}
                    onChange={(e) => setDeactivatePassword(e.target.value)}
                    className="border-border-input focus:border-brand-purple-500 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm transition-colors duration-200 outline-none"
                    placeholder="Enter your current password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmDeactivatePassword(!showConfirmDeactivatePassword)}
                    className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {showConfirmDeactivatePassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeactivateModal}
                  className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deactivateAccount.isPending}
                  className="focus-visible:ring-brand-purple-300 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:ring-2 focus-visible:outline-none disabled:bg-red-400"
                >
                  {deactivateAccount.isPending ? 'Deactivating...' : 'Deactivate account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
