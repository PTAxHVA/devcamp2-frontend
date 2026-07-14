import { RoadmapArt } from '@/features/roadmap/components/roadmap-art'

interface ActiveRoadmapCardProps {
  title: string
  progress: number
  done: number
  total: number
}

/** Mini roadmap card in the profile "Active roadmaps" strip — shows the real
 *  roadmap title + progress, using the same art as the browse roadmap card. */
export function ActiveRoadmapCard({ title, progress, done, total }: ActiveRoadmapCardProps) {
  return (
    <div className="border-border-soft bg-bg-card flex min-w-0 flex-1 flex-col gap-3 rounded-xl border p-4 sm:min-w-56">
      <RoadmapArt title={title} variant="compact" />

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
