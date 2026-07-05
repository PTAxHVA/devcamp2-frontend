import type { CSSProperties } from 'react'
import { FiAward, FiMap, FiZap } from 'react-icons/fi'
import type { PublicPassport } from '../lib/passport-api'
import { calcPassportCompletionPct, formatSkillLevel } from '../lib/passport-share'
import { PassportBadgeGrid } from './passport-badge-grid'
import { PassportSharePanel } from './passport-share-panel'
import { PassportCertificates } from './passport-certificates'

interface PassportContentProps {
  passport: PublicPassport
  passportUrl: string
}

/**
 * The passport body (identity, stats, badges, certificates, share) — shared by
 * the public /p/:shareToken page and the owner's /passport preview so both
 * always render the exact same thing.
 */
export function PassportContent({ passport, passportUrl }: PassportContentProps) {
  const completionPct = calcPassportCompletionPct(passport.completedCount, passport.totalCount)

  return (
    <>
      <section className="border-border-soft bg-bg-card rounded-3xl border p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="bg-brand-purple-500 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl font-black text-white">
            {passport.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-muted text-[11px] font-bold tracking-widest uppercase">
              Verified Skill Passport
            </p>
            <h1 className="text-text-primary mt-1 truncate text-2xl font-extrabold">
              {passport.username}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="bg-bg-lavender text-brand-purple-600 rounded-full px-2.5 py-1 text-xs font-semibold">
                {formatSkillLevel(passport.level)}
              </span>
              {passport.roadmaps.map((roadmap) => (
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
            style={{ '--value': completionPct, '--size': '5.5rem' } as CSSProperties}
            role="progressbar"
            aria-label="Roadmap completion"
          >
            {completionPct}%
          </div>
        </div>
        <div className="border-border-soft mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-center">
          <div>
            <p className="text-text-primary text-xl font-extrabold">{passport.completedCount}</p>
            <p className="text-text-muted text-xs font-medium">
              Verified topic{passport.completedCount === 1 ? '' : 's'} of {passport.totalCount}
            </p>
          </div>
          <div>
            <p className="text-text-primary inline-flex items-center gap-1 text-xl font-extrabold">
              <FiZap className="text-brand-purple-500 h-4 w-4" /> {passport.streak}
            </p>
            <p className="text-text-muted text-xs font-medium">Day streak</p>
          </div>
          <div>
            <p className="text-text-primary text-xl font-extrabold">{passport.longestStreak}</p>
            <p className="text-text-muted text-xs font-medium">Longest streak</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-text-primary mb-3 flex items-center gap-2 text-sm font-bold">
          <FiAward className="text-brand-purple-500 h-4 w-4" /> Verified skills
        </h2>
        <PassportBadgeGrid topics={passport.verifiedTopics} />
      </section>

      <PassportCertificates username={passport.username} roadmaps={passport.roadmaps} />

      <section className="border-border-soft bg-bg-card rounded-3xl border p-6">
        <h2 className="text-text-primary mb-4 text-sm font-bold">Share this passport</h2>
        <PassportSharePanel passportUrl={passportUrl} />
      </section>
    </>
  )
}
