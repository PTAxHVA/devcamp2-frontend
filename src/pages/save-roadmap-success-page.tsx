import { useLocation, useNavigate } from 'react-router'
import { FiCheckCircle, FiHome, FiMap, FiEdit3 } from 'react-icons/fi'

export function SaveRoadmapSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const roadmapId = location.state?.roadmapId || ''

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm duration-700 ease-out">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-50 opacity-75 duration-1000"></div>
          <FiCheckCircle className="relative z-10 h-12 w-12 text-green-500" />
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-800">
          Roadmap saved successfully!
        </h1>
        <p className="mb-10 text-lg text-slate-500">
          Your new journey has been added to your Dashboard. Get ready to conquer the challenges
          ahead!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            disabled={!roadmapId}
            className="btn h-12 w-full rounded-xl bg-slate-900 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
          >
            <FiMap className="mr-2 h-5 w-5" /> View Roadmap
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline h-12 w-full rounded-xl border-slate-200 text-base font-bold text-slate-600 transition-all hover:bg-slate-50"
          >
            <FiHome className="mr-2 h-5 w-5" /> Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/roadmaps/${roadmapId}/edit`)}
            disabled={!roadmapId}
            className="btn btn-ghost h-12 w-full rounded-xl text-base font-medium text-slate-500 transition-all hover:text-slate-700 disabled:opacity-50"
          >
            <FiEdit3 className="mr-2 h-4 w-4" /> Edit preferences
          </button>
        </div>
      </div>
    </div>
  )
}
