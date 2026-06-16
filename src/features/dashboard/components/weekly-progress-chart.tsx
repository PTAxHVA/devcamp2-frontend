import { FiBarChart2 } from 'react-icons/fi'

export function WeeklyProgressChart({ counts = [0, 0, 0, 0, 0, 0, 0] }: { counts?: number[] }) {
  const max = Math.max(1, ...counts)
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 p-4 animate-fade-in transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FiBarChart2 className="text-primary w-5 h-5" />
        <h3 className="font-bold">Weekly Progress</h3>
      </div>
      <div className="flex items-end justify-between h-32 gap-2">
        {counts.map((count, i) => (
          <div key={days[i]} className="flex flex-col items-center w-full group">
            <div
              className="w-full bg-primary/20 rounded-t-sm transition-all duration-500 group-hover:bg-primary group-hover:scale-105"
              style={{ height: `${(count / max) * 100}%`, minHeight: '4px' }}
            ></div>
            <span className="text-xs mt-2 text-base-content/70">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
