const DEFAULT_MAX = 10

/**
 * Round the busiest day up to a clean even ceiling (minimum 10) so the Y-axis
 * ticks land on 0, 2, 4, … — a 0–10 scale for a normal week, growing by 2s only
 * if a single day tops 10.
 */
export function weeklyChartMax(counts: number[]): number {
  const peak = counts.length ? Math.max(0, ...counts) : 0
  return Math.max(DEFAULT_MAX, Math.ceil(peak / 2) * 2)
}
