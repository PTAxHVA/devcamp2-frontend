import { useNavigate } from 'react-router'
import { FiCheck, FiGrid, FiCompass } from 'react-icons/fi'

/**
 * Roadmap-completion celebration. Reached at /roadmaps/:id/complete.
 * Stats (topics, duration, certificate) are intentionally omitted until a
 * completion-summary endpoint exists — we don't show fabricated numbers.
 */
export function RoadmapCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-3xl p-6 duration-700">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] border bg-white p-10 text-center shadow-sm">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl"></div>

        <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-indigo-50 bg-white text-indigo-600 shadow-xl shadow-indigo-100">
          <FiCheck className="h-14 w-14" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
            Congratulations! You completed your roadmap
          </h1>
          <p className="mt-3 max-w-xl text-lg font-medium text-slate-500">
            Amazing work — you've gone the distance and built a real set of skills.
          </p>
        </div>

        <div className="relative z-10 mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn h-12 rounded-xl bg-slate-900 px-8 font-bold text-white hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <FiGrid className="mr-2 h-5 w-5" /> Back to dashboard
          </button>
          <button
            onClick={() => navigate('/roadmaps/browse')}
            className="btn h-12 rounded-xl border-slate-200 bg-white px-8 font-bold text-slate-700 hover:bg-slate-50"
          >
            <FiCompass className="mr-2 h-5 w-5" /> Explore more roadmaps
          </button>
        </div>
      </div>
    </div>
  )
}
