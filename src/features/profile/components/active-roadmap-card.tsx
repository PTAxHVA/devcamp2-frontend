interface ActiveRoadmapCardProps {
  title: string
  progress: number
  done: number
  total: number
}

/** Mini roadmap card in the profile "Active roadmaps" strip — shows the real
 *  roadmap title + progress, no fabricated topic names. */
export function ActiveRoadmapCard({ title, progress, done, total }: ActiveRoadmapCardProps) {
  return (
    <div className="border-border-soft bg-bg-card flex min-w-0 flex-1 flex-col gap-3 rounded-xl border p-4 sm:min-w-56">
      <div className="bg-bg-section flex h-24 w-full items-center justify-center rounded-lg">
        <div className="text-text-muted flex flex-col items-center gap-1.5 opacity-60 select-none">
          <span className="border-border-input max-w-[9rem] truncate rounded border px-2 py-0.5 text-[10px]">
            {title}
          </span>
          <div className="bg-border-input h-3 w-px" />
          <div className="flex gap-4">
            <div className="bg-border-input h-3 w-px" />
            <div className="bg-border-input h-3 w-px" />
          </div>
          <div className="flex gap-2">
            <span className="bg-border-input h-2 w-10 rounded" />
            <span className="bg-border-input h-2 w-10 rounded" />
          </div>
        </div>
      </div>

      <p className="text-text-primary text-sm leading-snug font-bold">{title}</p>

      <div className="bg-border-soft h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="bg-brand-purple-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-text-muted text-xs">
        {progress}% complete • {done} of {total} sections
      </p>
    </div>
  )
}
