import { RiTrophyFill, RiArrowRightLine } from 'react-icons/ri'

interface RoadmapCompleteBannerProps {
  onViewCertificate: () => void
}

/**
 * Celebration strip shown at the top of the learning journey once every topic is
 * complete. Its CTA leads to the roadmap-complete page (Congratulations +
 * printable certificate). Purely presentational — the page owns navigation.
 */
export default function RoadmapCompleteBanner({ onViewCertificate }: RoadmapCompleteBannerProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
          <RiTrophyFill className="h-6 w-6" />
        </div>
        <div>
          <p className="text-text-primary text-base font-black">Roadmap complete! 🎉</p>
          <p className="text-text-muted mt-0.5 text-sm">
            You finished every topic — grab your certificate.
          </p>
        </div>
      </div>
      <button
        onClick={onViewCertificate}
        className="btn h-11 w-full shrink-0 rounded-xl bg-emerald-600 px-6 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
      >
        View your certificate <RiArrowRightLine className="ml-1.5 h-5 w-5" />
      </button>
    </div>
  )
}
