import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { FiAward, FiMap, FiZap } from 'react-icons/fi'
import { VoraWordmark } from '@/components/ui/vora-logo'
import { usePublicPassport } from './hooks/use-passport'
import { isPassportNotFoundError } from './lib/passport-api'
import { buildPassportUrl, calcPassportCompletionPct, formatSkillLevel } from './lib/passport-share'
import { PassportBadgeGrid } from './components/passport-badge-grid'
import { PassportSharePanel } from './components/passport-share-panel'

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
            <section className="border-border-soft rounded-3xl border bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="bg-brand-purple-500 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl font-black text-white">
                  {data.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-muted text-[11px] font-bold tracking-widest uppercase">
                    Verified Skill Passport
                  </p>
                  <h1 className="text-text-primary mt-1 truncate text-2xl font-extrabold">
                    {data.username}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="bg-bg-lavender text-brand-purple-600 rounded-full px-2.5 py-1 text-xs font-semibold">
                      {formatSkillLevel(data.level)}
                    </span>
                    {data.roadmaps.map((roadmap) => (
                      <span
                        key={roadmap.name}
                        className="bg-bg-section text-text-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                      >
                        <FiMap className="h-3 w-3" /> {roadmap.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="radial-progress text-brand-purple-500 shrink-0 text-lg font-extrabold"
                  style={
                    {
                      '--value': calcPassportCompletionPct(data.completedCount, data.totalCount),
                      '--size': '5.5rem',
                    } as CSSProperties
                  }
                  role="progressbar"
                  aria-label="Roadmap completion"
                >
                  {calcPassportCompletionPct(data.completedCount, data.totalCount)}%
                </div>
              </div>
              <div className="border-border-soft mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-center">
                <div>
                  <p className="text-text-primary text-xl font-extrabold">{data.completedCount}</p>
                  <p className="text-text-muted text-xs font-medium">
                    Verified topic{data.completedCount === 1 ? '' : 's'} of {data.totalCount}
                  </p>
                </div>
                <div>
                  <p className="text-text-primary inline-flex items-center gap-1 text-xl font-extrabold">
                    <FiZap className="text-brand-purple-500 h-4 w-4" /> {data.streak}
                  </p>
                  <p className="text-text-muted text-xs font-medium">Day streak</p>
                </div>
                <div>
                  <p className="text-text-primary text-xl font-extrabold">{data.longestStreak}</p>
                  <p className="text-text-muted text-xs font-medium">Longest streak</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-text-primary mb-3 flex items-center gap-2 text-sm font-bold">
                <FiAward className="text-brand-purple-500 h-4 w-4" /> Verified skills
              </h2>
              <PassportBadgeGrid topics={data.verifiedTopics} />
            </section>

            <section className="border-border-soft rounded-3xl border bg-white p-6">
              <h2 className="text-text-primary mb-4 text-sm font-bold">Share this passport</h2>
              <PassportSharePanel
                passportUrl={buildPassportUrl(window.location.origin, shareToken ?? '')}
              />
            </section>

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
