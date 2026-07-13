export interface ActivityPoint {
  date: string // YYYY-MM-DD (UTC+7 calendar day)
  count: number // sections completed that day
}

export interface ActivityResponse {
  days: number
  baseline: number // sections completed before the window (for the cumulative line)
  series: ActivityPoint[]
}

/** A chart row: the daily count plus the running lifetime total. */
export interface ActivityChartPoint extends ActivityPoint {
  cumulative: number
}
