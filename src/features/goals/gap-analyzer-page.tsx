import { useState } from 'react'
import toast from 'react-hot-toast'
import { TbTargetArrow } from 'react-icons/tb'
import { FiCheckCircle } from 'react-icons/fi'
import { extractApiError } from '@/lib/api-client'
import { useAnalyzeJobReadiness, useJobReadinessRoles } from './hooks/use-job-readiness'
import { ReadinessGauge } from './components/readiness-gauge'
import { GapTopicList } from './components/gap-topic-list'
import { AddMissingPanel } from './components/add-missing-panel'

/**
 * /goals — Job-Readiness Gap Analyzer. Pick a target role, let the backend map
 * its required skills onto the curated topic library, and compare that against
 * quiz-verified progress: readiness %, gap table, one-click "add missing".
 */
export function GapAnalyzerPage() {
  const rolesQuery = useJobReadinessRoles()
  const [role, setRole] = useState('')
  const analyzeMutation = useAnalyzeJobReadiness()
  const result = analyzeMutation.data

  const handleAnalyze = () => {
    if (!role) return
    analyzeMutation.mutate(role, {
      onError: (err) => {
        const { code, message } = extractApiError(err)
        toast.error(
          code === 'RATE_LIMITED'
            ? 'The AI is busy — please try again in a minute.'
            : (message ?? 'Could not run the analysis. Please try again.'),
        )
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-text-primary text-2xl font-extrabold">Career goals</h1>
        <p className="text-text-muted mt-1 text-sm">
          Pick a target role — we map the skills it needs to VORA topics and check them against your
          quiz-verified progress.
        </p>
      </div>

      <div className="border-border-soft flex flex-col gap-3 rounded-3xl border bg-white p-6 sm:flex-row sm:items-center">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={rolesQuery.isLoading}
          aria-label="Target role"
          className="focus:border-brand-purple-500 border-border-soft w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium outline-none sm:max-w-xs"
        >
          <option value="">
            {rolesQuery.isLoading ? 'Loading roles…' : 'Choose a target role…'}
          </option>
          {(rolesQuery.data ?? []).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!role || analyzeMutation.isPending}
          className="bg-btn-primary-bg hover:bg-btn-primary-hover rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {analyzeMutation.isPending ? 'Analyzing…' : 'Analyze my readiness'}
        </button>
      </div>

      {rolesQuery.isError && (
        <div className="border-border-soft rounded-2xl border bg-white p-4 text-center">
          <p className="text-text-muted text-sm">Couldn't load the role list.</p>
          <button
            type="button"
            onClick={() => rolesQuery.refetch()}
            className="text-brand-purple-600 mt-1 text-sm font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {analyzeMutation.isPending && (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-brand-purple-500" />
        </div>
      )}

      {!analyzeMutation.isPending && result && (
        <>
          <ReadinessGauge result={result} />
          <GapTopicList
            verified={result.verified}
            inProgress={result.inProgress}
            missing={result.missing}
          />
          {result.missing.length === 0 ? (
            <div className="flex items-center gap-3 rounded-3xl border border-green-200 bg-green-50 p-6">
              <FiCheckCircle className="h-6 w-6 shrink-0 text-green-600" />
              <p className="text-sm font-semibold text-green-700">
                Every topic this role needs is covered — keep verifying to reach 100%.
              </p>
            </div>
          ) : (
            <AddMissingPanel missing={result.missing} />
          )}
        </>
      )}

      {!analyzeMutation.isPending && !result && (
        <div className="border-border-soft flex flex-col items-center gap-3 rounded-3xl border bg-white p-10 text-center">
          <div className="bg-bg-lavender flex h-14 w-14 items-center justify-center rounded-2xl">
            <TbTargetArrow className="text-brand-purple-500 h-7 w-7" />
          </div>
          <p className="text-text-primary text-lg font-bold">Where do you want to work?</p>
          <p className="text-text-muted max-w-md text-sm">
            Choose a role above and analyze — you'll get a readiness score, a gap table of verified
            vs missing skills, and a one-click way to add what's missing to your roadmap.
          </p>
        </div>
      )}
    </div>
  )
}
