import { Link } from 'react-router'
import toast from 'react-hot-toast'
import axios from 'axios'
import { RiPassportLine } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'
import { useMyPassport, usePublicPassport, useUpdatePassport } from './hooks/use-passport'
import { buildPassportUrl } from './lib/passport-share'
import { PassportContent } from './components/passport-content'

/**
 * Owner view at /passport (protected, in the app layout): previews the exact
 * public passport when sharing is on, or offers the one-click opt-in when off.
 */
export function MyPassportPage() {
  const { data: settings, isLoading: isSettingsLoading } = useMyPassport()
  const updatePassport = useUpdatePassport()
  const isPublic = (settings?.isPublic ?? false) && !!settings?.shareToken
  const passportQuery = usePublicPassport(
    isPublic && settings?.shareToken ? settings.shareToken : '',
  )

  const handleEnable = () => {
    updatePassport.mutate(
      { isPublic: true },
      {
        onSuccess: () => toast.success('Your passport is now public'),
        onError: (err) => {
          const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message : null
          toast.error(msg ?? 'Could not turn on your passport')
        },
      },
    )
  }

  if (isSettingsLoading) {
    return (
      <div className="flex justify-center py-32">
        <span className="loading loading-spinner loading-lg text-brand-purple-500" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-text-primary text-2xl font-extrabold">My Passport</h1>
          <p className="text-text-muted mt-1 text-sm">
            Your quiz-verified skills, ready to share with recruiters and friends.
          </p>
        </div>
        <Link
          to="/settings"
          className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <FiSettings className="h-3.5 w-3.5" /> Manage sharing in Settings
        </Link>
      </div>

      {!isPublic && (
        <div className="border-border-soft bg-bg-card flex flex-col items-center gap-4 rounded-3xl border p-10 text-center">
          <div className="bg-bg-lavender flex h-14 w-14 items-center justify-center rounded-2xl">
            <RiPassportLine className="text-brand-purple-500 h-7 w-7" />
          </div>
          <div>
            <p className="text-text-primary text-lg font-bold">Your passport is private</p>
            <p className="text-text-muted mx-auto mt-2 max-w-md text-sm">
              Turn it on to get a public link that shows your username and quiz-verified skills —
              never your email. You can turn it off or change the link anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnable}
            disabled={updatePassport.isPending}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
          >
            {updatePassport.isPending ? 'Turning on…' : 'Turn on public sharing'}
          </button>
        </div>
      )}

      {isPublic && settings?.shareToken && (
        <>
          <div className="border-border-purple bg-bg-lavender text-brand-purple-700 rounded-2xl border px-4 py-3 text-xs font-semibold">
            This passport is public — anyone with the link or QR below sees exactly this page.
          </div>
          {passportQuery.isLoading && (
            <div className="flex justify-center py-24">
              <span className="loading loading-spinner loading-lg text-brand-purple-500" />
            </div>
          )}
          {passportQuery.data && (
            <PassportContent
              passport={passportQuery.data}
              passportUrl={buildPassportUrl(window.location.origin, settings.shareToken)}
            />
          )}
          {passportQuery.isError && (
            <div className="border-border-soft bg-bg-card rounded-2xl border p-8 text-center">
              <p className="text-text-muted text-sm">
                Couldn't load your passport preview — please try again.
              </p>
              <button
                type="button"
                onClick={() => passportQuery.refetch()}
                className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 mt-4 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
              >
                Try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
