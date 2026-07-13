import { lazy, Suspense } from 'react'
import { useActivity } from '../hooks/use-activity'

// recharts is heavy and only needed once a chart actually renders — lazy-load it
// so it stays out of the initial bundle (dashboard + profile share this panel).
const ActivityChart = lazy(() => import('./activity-chart'))

function ChartSkeleton() {
  return (
    <div className="flex h-[260px] items-center justify-center">
      <span className="loading loading-spinner loading-md text-brand-purple-500" />
    </div>
  )
}

function Legend() {
  return (
    <div className="text-text-secondary mb-2 flex flex-wrap gap-4 text-xs">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#8b5cf6', opacity: 0.5 }} />
        Sections / day
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded" style={{ background: '#003b71' }} />
        <span className="text-text-primary font-semibold">Total</span> (cumulative)
      </span>
    </div>
  )
}

/**
 * Shared body of the activity chart: legend + the loading/error/data states. Used
 * inline on the profile page and inside the dashboard "View full" modal, both fed
 * by the same `GET /me/activity` query.
 */
export function ActivityPanel() {
  const { data, isLoading, isError } = useActivity(30)

  return (
    <div>
      <Legend />
      {isLoading && <ChartSkeleton />}
      {isError && (
        <p className="text-text-muted py-16 text-center text-sm">
          Couldn't load your activity. Please try again.
        </p>
      )}
      {data && (
        <Suspense fallback={<ChartSkeleton />}>
          <ActivityChart data={data} />
        </Suspense>
      )}
    </div>
  )
}
