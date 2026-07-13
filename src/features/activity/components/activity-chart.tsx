import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { buildActivityData, formatActivityDate } from '../lib/build-activity-data'
import type { ActivityResponse } from '../types'

const PURPLE = '#8b5cf6'
const NAVY = '#003b71'

/**
 * Bars = sections completed per day (left axis); line = cumulative lifetime total
 * (right axis, straight `linear` segments). Default export so it can be lazily
 * imported — this is the only place recharts loads, keeping it out of the initial
 * bundle.
 */
export default function ActivityChart({ data }: { data: ActivityResponse }) {
  const rows = buildActivityData(data.series, data.baseline)
  // Thin the X ticks so ~30 daily labels don't collide (show ~6 across the window).
  const tickInterval = Math.max(0, Math.floor(rows.length / 6) - 1)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatActivityDate}
          interval={tickInterval}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          yAxisId="left"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <Tooltip
          labelFormatter={(label) => formatActivityDate(String(label))}
          formatter={(value, name) => [
            value as number,
            name === 'cumulative' ? 'Total sections' : 'Sections that day',
          ]}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Bar
          yAxisId="left"
          dataKey="count"
          name="count"
          fill={PURPLE}
          fillOpacity={0.5}
          radius={[3, 3, 0, 0]}
          maxBarSize={18}
        />
        <Line
          yAxisId="right"
          type="linear"
          dataKey="cumulative"
          name="cumulative"
          stroke={NAVY}
          strokeWidth={2.4}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
