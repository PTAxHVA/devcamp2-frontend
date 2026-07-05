import { useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ExternalLink, RefreshCw, Share2 } from 'lucide-react'
import { useMyPassport, useUpdatePassport } from '../hooks/use-passport'
import { buildPassportUrl } from '../lib/passport-share'
import { PassportSharePanel } from './passport-share-panel'

const mutationErrorMessage = (err: unknown, fallback: string): string => {
  const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
  return msg ?? fallback
}

/** "My Passport" card for Settings: opt-in toggle (default OFF), link/QR, regenerate. */
export function PassportSettingsCard() {
  const { data: passport, isLoading } = useMyPassport()
  const updatePassport = useUpdatePassport()
  const [isConfirmingRegenerate, setIsConfirmingRegenerate] = useState(false)

  const isPublic = passport?.isPublic ?? false
  const passportUrl = passport?.shareToken
    ? buildPassportUrl(window.location.origin, passport.shareToken)
    : null

  const handleToggle = () => {
    const next = !isPublic
    updatePassport.mutate(
      { isPublic: next },
      {
        onSuccess: () =>
          toast.success(next ? 'Your passport is now public' : 'Your passport is private again'),
        onError: (err) => toast.error(mutationErrorMessage(err, 'Could not update your passport')),
      },
    )
  }

  const handleRegenerate = () => {
    setIsConfirmingRegenerate(false)
    updatePassport.mutate(
      { isPublic: true, regenerate: true },
      {
        onSuccess: () => toast.success('New link created — the old one no longer works'),
        onError: (err) => toast.error(mutationErrorMessage(err, 'Could not regenerate the link')),
      },
    )
  }

  return (
    <div className="border-border-soft flex flex-col gap-5 rounded-2xl border bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="bg-bg-lavender flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Share2 className="text-brand-purple-500 h-4 w-4" />
        </div>
        <div>
          <p className="text-text-primary text-sm font-bold">My Skill Passport</p>
          <p className="text-text-muted mt-0.5 text-xs">
            A public page of your quiz-verified skills you can share with anyone.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-text-primary text-sm font-medium">Public passport</p>
          <p className="text-text-muted text-xs">
            Off by default. When on, anyone with the link sees your username and verified skills —
            never your email.
          </p>
        </div>
        <input
          type="checkbox"
          className="toggle shrink-0"
          checked={isPublic}
          onChange={handleToggle}
          disabled={isLoading || updatePassport.isPending}
          aria-label="Toggle public passport"
        />
      </div>

      {isPublic && passportUrl && (
        <div className="border-border-soft flex flex-col gap-4 border-t pt-4">
          <PassportSharePanel passportUrl={passportUrl} compact />
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/p/${passport?.shareToken ?? ''}`}
              target="_blank"
              className="border-border-input text-text-primary hover:bg-bg-section inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View my passport
            </Link>
            {isConfirmingRegenerate ? (
              <>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={updatePassport.isPending}
                  className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:bg-red-400"
                >
                  Confirm — old link will stop working
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingRegenerate(false)}
                  className="border-border-input text-text-primary hover:bg-bg-section rounded-lg border px-3.5 py-2 text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingRegenerate(true)}
                disabled={updatePassport.isPending}
                className="border-border-input text-text-primary hover:bg-bg-section inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate link
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
