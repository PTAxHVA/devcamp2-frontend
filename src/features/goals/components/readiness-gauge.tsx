import type { CSSProperties } from 'react'
import type { JobReadinessResult } from '../types'

interface ReadinessGaugeProps {
  result: JobReadinessResult
}

/** Readiness dial + one-line verdict for the analyzed role. */
export function ReadinessGauge({ result }: ReadinessGaugeProps) {
  return (
    <section className="border-border-soft flex flex-col items-center gap-4 rounded-3xl border bg-white p-6 sm:flex-row sm:gap-6 sm:p-8">
      <div
        className="radial-progress text-brand-purple-500 shrink-0 text-xl font-extrabold"
        style={
          {
            '--value': result.readinessPct,
            '--size': '7rem',
            '--thickness': '0.6rem',
          } as CSSProperties
        }
        role="progressbar"
        aria-valuenow={result.readinessPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Job readiness"
      >
        {result.readinessPct}%
      </div>
      <div className="min-w-0 text-center sm:text-left">
        <p className="text-text-muted text-[11px] font-bold tracking-widest uppercase">
          Job readiness
        </p>
        <h2 className="text-text-primary mt-1 text-xl font-extrabold">
          {result.readinessPct}% ready for {result.role}
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          {result.verified.length} verified · {result.inProgress.length} in progress ·{' '}
          {result.missing.length} missing
        </p>
        {typeof result.etaWeeks === 'number' && result.missing.length > 0 && (
          <p className="text-brand-purple-600 mt-2 text-sm font-semibold">
            ~{result.etaWeeks} week{result.etaWeeks === 1 ? '' : 's'} of learning to close the gap
            at your weekly pace.
          </p>
        )}
        {result.source === 'fallback' && (
          <p className="bg-bg-section text-text-secondary mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
            AI is busy right now — showing our curated checklist for this role.
          </p>
        )}
      </div>
    </section>
  )
}
