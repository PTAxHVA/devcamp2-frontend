import type { ActivityPoint, ActivityChartPoint } from '../types'

/**
 * Turn the BE daily series + pre-window baseline into chart rows: each row keeps
 * its daily count and a running cumulative total starting from the lifetime
 * baseline — the "commitment across your whole journey" line.
 */
export function buildActivityData(series: ActivityPoint[], baseline: number): ActivityChartPoint[] {
  let running = baseline
  return series.map((point) => {
    running += point.count
    return { ...point, cumulative: running }
  })
}

/** Short axis label (e.g. "Jul 8") from a YYYY-MM-DD date, kept in UTC so the
 *  label matches the UTC+7 calendar day the BE bucketed it into. */
export function formatActivityDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}
