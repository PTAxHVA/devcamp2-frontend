import { FiCalendar } from 'react-icons/fi'
import { FaFire } from 'react-icons/fa' // Thêm dòng này để lấy ngọn lửa
export function StreakCalendar({
  streak,
}: {
  streak: { lastActivityDate: string | null; todayCompleted: boolean }
}) {
  const days = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 p-4 animate-fade-in transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="text-primary w-5 h-5" />
        <h3 className="font-bold">Current Activity</h3>
      </div>
      <div className="flex justify-between gap-2">
        {days.map((day) => {
          const isToday = day === 6
          const isActive = isToday ? streak.todayCompleted : false
          return (
            <div
              key={day}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isActive
                  ? 'bg-primary text-primary-content shadow-md'
                  : 'bg-base-200 text-base-content/40'
              } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              {isActive ? (
                <FaFire className="w-5 h-5 animate-pulse" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current opacity-30"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
