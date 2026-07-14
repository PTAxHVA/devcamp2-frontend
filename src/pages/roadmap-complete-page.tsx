import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router'
import { FiCheck, FiCompass, FiGrid, FiPrinter } from 'react-icons/fi'
import { useRoadmapDetail } from '@/features/roadmap/hooks/use-roadmap-detail'
import { useMe } from '@/features/profile/hooks/use-profile'
import { CertificateCard } from '@/features/passport/components/certificate-card'
import { isRoadmapComplete } from '@/features/learning/lib/roadmap-completion'

/**
 * Roadmap-completion celebration. Reached at /roadmaps/:id/complete.
 * Includes a printable certificate (window.print + @media print isolation in
 * index.css) — real data only: username, role name, and topic count.
 */
export function RoadmapCompletePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { data, isLoading } = useRoadmapDetail(id ?? '')
  const { data: me } = useMe()

  const isPreview = searchParams.get('preview') === 'true'

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <span className="loading loading-spinner loading-lg text-indigo-600" />
      </div>
    )
  }

  // Only celebrate a genuinely 100%-complete roadmap (M4) — otherwise send the
  // learner back to the roadmap instead of a false "Congratulations". Uses the
  // shared section-progress predicate so this gate can't disagree with the
  // my-learning FINISH node / certificate CTA that navigates here.
  const isGenuinelyComplete = !!data && isRoadmapComplete(data.topics)
  const allComplete = isPreview || isGenuinelyComplete
  if (!allComplete) {
    return <Navigate to={id ? `/roadmaps/${id}` : '/dashboard'} replace />
  }

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-3xl p-6 duration-700">
      <div className="bg-bg-card relative flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] border p-6 text-center shadow-sm sm:p-10">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl"></div>

        <div className="bg-bg-card relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-indigo-50 text-indigo-600 shadow-xl shadow-indigo-100">
          <FiCheck className="h-14 w-14" />
        </div>
        <div className="relative z-10">
          <h1 className="text-text-primary text-3xl font-black tracking-tight md:text-4xl">
            Congratulations! You completed your roadmap
          </h1>
          <p className="text-text-muted mt-3 max-w-xl text-lg font-medium">
            Amazing work — you've gone the distance and built a real set of skills.
          </p>
        </div>

        <div className="relative z-10 mt-2 flex w-full flex-col gap-3 lg:flex-row lg:justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn focus-visible:ring-brand-purple-300 h-12 rounded-xl bg-slate-900 px-8 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:ring-2"
          >
            <FiGrid className="mr-2 h-5 w-5" /> Back to dashboard
          </button>
          <button
            onClick={() => navigate('/roadmaps/browse')}
            className="btn border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 h-12 rounded-xl px-8 font-bold transition-colors duration-200 focus-visible:ring-2"
          >
            <FiCompass className="mr-2 h-5 w-5" /> Explore more roadmaps
          </button>
        </div>
      </div>

      {/* Printable certificate — rendered once the owner's username is known and the roadmap is genuinely completed */}
      {me?.username && data && isGenuinelyComplete && (
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-text-primary text-sm font-bold">Your certificate</h2>
            <button
              onClick={() => window.print()}
              className="btn border-border-soft bg-bg-card text-text-secondary hover:bg-bg-section focus-visible:ring-brand-purple-300 h-10 w-full rounded-xl px-5 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 sm:w-auto"
            >
              <FiPrinter className="mr-2 h-4 w-4" /> Print / save as PDF
            </button>
          </div>
          <CertificateCard
            username={me.username}
            roleName={data.roadmap.roleName}
            topicsCount={data.topics.length}
          />
        </div>
      )}
    </div>
  )
}
