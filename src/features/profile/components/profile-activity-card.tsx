import { ActivityPanel } from '@/features/activity/components/activity-panel'

/** Full-width "Learning activity" card on the profile page — the same bars+line
 *  chart the dashboard's "View full" opens, shown inline here. */
export function ProfileActivityCard() {
  return (
    <div className="border-border-soft bg-bg-card rounded-2xl border p-5">
      <div className="mb-1">
        <p className="text-text-primary text-sm font-bold">Learning activity</p>
        <p className="text-text-muted text-xs">Last 30 days</p>
      </div>
      <ActivityPanel />
    </div>
  )
}
