import { Link, useParams } from 'react-router'
import { VoraWordmark } from '@/components/ui/vora-logo'
import { usePublicPassport } from './hooks/use-passport'
import { isPassportNotFoundError } from './lib/passport-api'
import { buildPassportUrl } from './lib/passport-share'
import { PassportContent } from './components/passport-content'

/**
 * Public Verified Skill Passport — /p/:shareToken. Standalone page OUTSIDE the
 * auth guard and app layout: it must render for logged-out visitors (recruiters,
 * judges) straight from a shared link or QR scan.
 */
export function PublicPassportPage() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const { data, isLoading, isError, error, refetch } = usePublicPassport(shareToken ?? '')

  return (
    <div className="bg-bg-soft min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
        <Link to="/" aria-label="VORA home">
          <VoraWordmark />
        </Link>
        <Link
          to="/"
          className="border-border-purple text-brand-purple-600 hover:bg-bg-lavender rounded-lg border px-4 py-2 text-xs font-semibold transition"
        >
          Start learning on VORA →
        </Link>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-5 px-4 pt-2 pb-16">
        {isLoading && (
          <div className="flex justify-center py-32">
            <span className="loading loading-spinner loading-lg text-brand-purple-500" />
          </div>
        )}

        {isError &&
          (isPassportNotFoundError(error) ? (
            <div className="border-border-soft mx-auto mt-16 w-full max-w-md rounded-2xl border bg-white p-8 text-center">
              <p className="text-text-primary text-lg font-bold">Passport not found</p>
              <p className="text-text-muted mt-2 text-sm">
                This link doesn't exist or its owner has turned sharing off.
              </p>
            </div>
          ) : (
            <div className="border-border-soft mx-auto mt-16 w-full max-w-md rounded-2xl border bg-white p-8 text-center">
              <p className="text-text-primary text-lg font-bold">Couldn't load this passport</p>
              <p className="text-text-muted mt-2 text-sm">
                The server may just be waking up — give it a few seconds.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="bg-btn-primary-bg hover:bg-btn-primary-hover mt-5 rounded-lg px-5 py-2 text-sm font-semibold text-white transition"
              >
                Try again
              </button>
            </div>
          ))}

        {data && (
          <>
            <PassportContent
              passport={data}
              passportUrl={buildPassportUrl(window.location.origin, shareToken ?? '')}
            />
            <p className="text-text-muted text-center text-xs">
              Every badge above was earned by passing section quizzes (≥80%) on VORA — progress is
              quiz-verified, never self-reported.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
