import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { buildActivityData, formatActivityDate } from '../lib/build-activity-data'
import type { ActivityResponse } from '../types'

// recharts fills need a literal color, not a Tailwind class — these mirror the
// `@theme` tokens in src/index.css (kept as local consts on purpose, not read
// from CSS at runtime).
const BAR_FROM = '#7c3aed' // --color-brand-purple-500
const BAR_TO = '#a78bfa' // --color-brand-purple-300
const AXIS_TICK = '#94a3b8' // --color-text-placeholder
const TOOLTIP_BORDER = '#e2e8f0' // --color-border-soft

const CHART_HEIGHT = 260

/**
 * Column-per-day activity chart. The cumulative lifetime total used to be a
 * second line on its own right-hand axis — now it's a single KPI headline
 * above the bars, so the chart itself only has to communicate one series.
 * Default export so it can be lazily imported (`activity-panel.tsx`) — this is
 * the only place recharts loads, keeping it out of the initial bundle.
 */
export default function ActivityChart({ data }: { data: ActivityResponse }) {
  const rows = buildActivityData(data.series, data.baseline)
  const total = rows.length > 0 ? rows[rows.length - 1].cumulative : data.baseline

  if (total === 0) {
    return (
      <div
        style={{ height: CHART_HEIGHT }}
        className="flex flex-col items-center justify-center gap-1 text-center"
      >
        <p className="text-text-primary text-sm font-semibold">No activity yet</p>
        <p className="text-text-muted text-xs">Finish a section quiz to start your streak.</p>
      </div>
    )
  }

  // Thin the X ticks so ~30 daily labels don't collide (show ~6 across the window).
  const tickInterval = Math.max(0, Math.floor(rows.length / 6) - 1)

  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-text-primary text-2xl font-extrabold">{total}</span>
        <span className="text-text-muted text-sm font-medium">sections completed total</span>
      </div>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
          <defs>
            <linearGradient id="activityBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BAR_FROM} stopOpacity={0.95} />
              <stop offset="100%" stopColor={BAR_TO} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatActivityDate}
            interval={tickInterval}
            tick={{ fontSize: 11, fill: AXIS_TICK }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            labelFormatter={(label) => formatActivityDate(String(label))}
            formatter={(value) => [value as number, 'Sections that day']}
            contentStyle={{ borderRadius: 12, border: `1px solid ${TOOLTIP_BORDER}`, fontSize: 12 }}
            cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }}
          />
          <Bar
            dataKey="count"
            name="count"
            fill="url(#activityBarFill)"
            radius={[6, 6, 0, 0]}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
