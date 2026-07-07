import { FiBarChart2 } from 'react-icons/fi'
import { weeklyChartMax } from './weekly-progress-chart.utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyProgressChart({ counts = [0, 0, 0, 0, 0, 0, 0] }: { counts?: number[] }) {
  const niceMax = weeklyChartMax(counts)
  // Tick values from niceMax down to 0 in steps of 2 (top-to-bottom order).
  const ticks = Array.from({ length: niceMax / 2 + 1 }, (_, i) => niceMax - i * 2)

  return (
    <div className="card bg-base-100 border-base-200 animate-fade-in border p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiBarChart2 className="text-brand-purple-600 h-5 w-5" />
        <h3 className="font-bold">Weekly Progress</h3>
      </div>
      <div className="flex gap-2">
        {/* Y axis: section-count ticks, aligned to the gridlines to their right. */}
        <div className="text-base-content/50 flex h-32 w-4 flex-col justify-between text-right text-[10px] leading-none">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="flex-1">
          <div className="relative h-32">
            {/* Horizontal gridlines, one per Y tick. */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {ticks.map((t) => (
                <div key={t} className="border-base-200 border-t border-dashed" />
              ))}
            </div>
            {/* Bars, scaled against the same niceMax as the ticks. */}
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {counts.map((count, i) => (
                <div key={DAYS[i]} className="group flex h-full w-full items-end">
                  <div
                    className="bg-brand-purple-300/40 group-hover:bg-brand-purple-500 w-full rounded-t-sm transition-colors duration-200"
                    style={{
                      height: `${(count / niceMax) * 100}%`,
                      minHeight: count > 0 ? '4px' : '0',
                    }}
                    title={`${count} section${count === 1 ? '' : 's'}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Day labels, aligned under their bars. */}
          <div className="mt-2 flex justify-between gap-2">
            {DAYS.map((d) => (
              <span key={d} className="text-base-content/70 w-full text-center text-xs">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
