import { FiCalendar } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'

function deriveActivityDays(streak: {
  currentStreak: number
  lastActivityDate: string | null
}): boolean[] {
  if (!streak.lastActivityDate || streak.currentStreak === 0) return Array(7).fill(false)

  const lastActivity = new Date(streak.lastActivityDate)
  lastActivity.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysSinceLast = Math.round(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
  )

  // i=0 → 6 days ago, i=6 → today. Day i is active if it falls within the streak window
  // ending at lastActivityDate.
  return Array.from({ length: 7 }, (_, i) => {
    const dayOffset = 6 - i
    return dayOffset >= daysSinceLast && dayOffset < daysSinceLast + streak.currentStreak
  })
}

export function StreakCalendar({
  streak,
}: {
  streak: { currentStreak: number; lastActivityDate: string | null; todayCompleted: boolean }
}) {
  const activityDays = deriveActivityDays(streak)

  const today = new Date()
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return {
      short: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
      date: d.getDate(),
    }
  })

  return (
    <div className="card bg-base-100 border-base-200 animate-fade-in border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FiCalendar className="text-primary h-5 w-5" />
        <h3 className="font-bold">Current Activity</h3>
      </div>
      <div className="flex justify-between gap-1">
        {dayLabels.map(({ short, date }, i) => {
          const isToday = i === 6
          const isActive = activityDays[i]
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-base-content/40 text-xs font-medium">{short}</span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-md'
                    : 'bg-base-200 text-base-content/40'
                } ${isToday ? 'ring-primary ring-2 ring-offset-2' : ''}`}
              >
                {isActive ? (
                  <FaFire className="h-5 w-5 animate-pulse" />
                ) : (
                  <span className="text-xs font-semibold opacity-40">{date}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
