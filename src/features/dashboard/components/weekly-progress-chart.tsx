import { FiBarChart2 } from 'react-icons/fi'

export function WeeklyProgressChart({ counts = [0, 0, 0, 0, 0, 0, 0] }: { counts?: number[] }) {
  const max = Math.max(1, ...counts)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="card bg-base-100 border-base-200 animate-fade-in border p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <FiBarChart2 className="text-brand-purple-600 h-5 w-5" />
        <h3 className="font-bold">Weekly Progress</h3>
      </div>
      <div className="flex h-32 items-end justify-between gap-2">
        {counts.map((count, i) => (
          <div key={days[i]} className="group flex h-full w-full flex-col items-center justify-end">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="bg-brand-purple-300/30 group-hover:bg-brand-purple-500 w-full rounded-t-sm transition-all duration-500 group-hover:scale-105"
                style={{ height: `${(count / max) * 100}%`, minHeight: '4px' }}
              ></div>
            </div>
            <span className="text-base-content/70 mt-2 text-xs">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
