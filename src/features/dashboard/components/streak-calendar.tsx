import { FiCalendar } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa'
import {
  deriveCurrentWeekActivity,
  mondayFirstWeekdayIndex,
} from '@/features/dashboard/lib/streak-activity'

export function StreakCalendar({
  streak,
}: {
  streak: {
    currentStreak: number
    lastActivityDate: string | null
    activityDays?: boolean[]
    todayCompleted: boolean
  }
}) {
  // Per-day counts from the API arrive as Monday…Sunday of the current week, so
  // render that week directly; otherwise derive it from the streak window.
  const activityDays =
    streak.activityDays && streak.activityDays.length === 7
      ? streak.activityDays
      : deriveCurrentWeekActivity(streak.currentStreak, streak.lastActivityDate)

  const today = new Date()
  const todayIndex = mondayFirstWeekdayIndex(today)
  const monday = new Date(today)
  monday.setDate(today.getDate() - todayIndex)

  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return {
      short: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
      date: d.getDate(),
    }
  })

  return (
    <div className="card bg-base-100 border-base-200 animate-fade-in border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FiCalendar className="text-primary h-5 w-5" />
        <h3 className="font-bold">This Week</h3>
      </div>
      <div className="flex justify-between gap-1">
        {dayLabels.map(({ short, date }, i) => {
          const isToday = i === todayIndex
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
