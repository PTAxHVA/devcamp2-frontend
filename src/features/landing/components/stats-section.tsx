import { cn } from '@/lib/utils'
import { WRAP } from '../lib/landing-styles'

const STATS = [
  { value: '2', label: 'Curated roadmaps' },
  { value: '~900', label: 'Quiz questions' },
  { value: '≥80%', label: 'To pass a section' },
  { value: '100%', label: 'Human-curated content' },
]

// Vertical divider between columns, only once they line up in the 4-col layout (≥720px).
const DIVIDER =
  "min-[720px]:before:bg-border-soft min-[720px]:before:absolute min-[720px]:before:left-0 min-[720px]:before:top-1/2 min-[720px]:before:h-[34px] min-[720px]:before:w-px min-[720px]:before:-translate-y-1/2 min-[720px]:before:content-['']"

export const StatsSection = () => (
  <section className="border-border-soft border-y bg-white">
    <div className={cn(WRAP, 'grid grid-cols-2 gap-x-2 gap-y-5 py-[26px] min-[720px]:grid-cols-4')}>
      {STATS.map((stat, index) => (
        <div key={stat.label} className={cn('relative text-center', index > 0 && DIVIDER)}>
          <b className="text-text-primary block text-[1.7rem] font-extrabold tracking-[-0.02em] tabular-nums">
            {stat.value}
          </b>
          <span className="text-text-muted text-[0.82rem] font-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  </section>
)
