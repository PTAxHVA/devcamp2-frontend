import { FiCalendar } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa' // Thêm dòng này để lấy ngọn lửa
export function StreakCalendar({
  streak,
}: {
  streak: { lastActivityDate: string | null; todayCompleted: boolean }
}) {
  const days = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div className="card bg-base-100 border-base-200 animate-fade-in border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FiCalendar className="text-primary h-5 w-5" />
        <h3 className="font-bold">Current Activity</h3>
      </div>
      <div className="flex justify-between gap-2">
        {days.map((day) => {
          const isToday = day === 6
          const isActive = isToday ? streak.todayCompleted : false
          return (
            <div
              key={day}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 ${
                isActive
                  ? 'bg-primary text-primary-content shadow-md'
                  : 'bg-base-200 text-base-content/40'
              } ${isToday ? 'ring-primary ring-2 ring-offset-2' : ''}`}
            >
              {isActive ? (
                <FaFire className="h-5 w-5 animate-pulse" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-current opacity-30"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
