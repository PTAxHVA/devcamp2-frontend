import { FiCheck, FiClock, FiBook, FiAward, FiDownload, FiShare2 } from 'react-icons/fi'

export function RoadmapCompletePage() {
  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-6xl p-6 duration-700">
      <div className="relative mb-10 flex flex-col items-center gap-8 overflow-hidden rounded-[2rem] border bg-white p-10 shadow-sm md:flex-row">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl"></div>

        <div className="relative z-10 flex h-32 w-32 min-w-[8rem] items-center justify-center rounded-full border-[6px] border-indigo-50 bg-white text-indigo-600 shadow-xl shadow-indigo-100">
          <FiCheck className="h-16 w-16" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl leading-tight font-black tracking-tight text-slate-800 md:text-5xl">
            Congratulations! <br />
            You completed your roadmap
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium text-slate-500">
            Amazing work! You've gone the distance and built an incredible set of skills.
          </p>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex items-center gap-5 rounded-3xl border bg-white p-6 shadow-sm transition-colors hover:border-indigo-200">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FiBook className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Total topics
            </p>
            <p className="text-2xl font-black text-slate-800">42</p>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-3xl border bg-white p-6 shadow-sm transition-colors hover:border-indigo-200">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FiClock className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Duration
            </p>
            <p className="text-2xl font-black text-slate-800">14 wks</p>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-3xl border bg-white p-6 shadow-sm transition-colors hover:border-indigo-200">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FiAward className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Outcome
            </p>
            <p className="text-xl leading-none font-black text-slate-800">Mastered</p>
          </div>
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex min-h-[400px] items-center justify-center rounded-[2rem] border bg-slate-50 p-10 lg:col-span-2">
          <div className="text-center opacity-40">
            <p className="mb-2 text-2xl font-black text-slate-800">
              [ Roadmap Tree Visualization ]
            </p>
            <p className="font-medium text-slate-600">Will be rendered dynamically</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-800">Your achievement</h3>
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <FiAward className="h-8 w-8" />
              </div>
              <div>
                <p className="leading-snug font-bold text-slate-700">
                  You're in the <span className="font-black text-indigo-600">top 8%</span> of
                  learners who complete this roadmap.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Keep building. Your future self will thank you.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-slate-800">What you unlocked</h3>
            <div className="space-y-4">
              <div className="flex cursor-default items-center gap-4 rounded-2xl border bg-slate-50 p-4 transition-colors hover:bg-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-black text-purple-600">
                  FE
                </span>
                <div>
                  <p className="font-bold text-slate-800">Frontend Developer</p>
                  <p className="text-xs font-medium text-slate-500">Skill badge</p>
                </div>
              </div>
              <div className="flex cursor-default items-center gap-4 rounded-2xl border bg-slate-50 p-4 transition-colors hover:bg-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-black text-blue-600">
                  {'</>'}
                </span>
                <div>
                  <p className="font-bold text-slate-800">Capstone Project</p>
                  <p className="text-xs font-medium text-slate-500">Build and showcase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-xl font-bold text-slate-800">
          What's next?{' '}
          <span className="ml-2 text-lg font-medium text-slate-500">
            Keep the momentum going. Choose your next step.
          </span>
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <button className="group rounded-3xl border bg-white p-6 text-left transition-all hover:border-indigo-200 hover:shadow-lg">
            <div className="mb-4 inline-block rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-110">
              <FiShare2 className="h-6 w-6" />
            </div>
            <p className="mb-1 font-bold text-slate-800">Share your success</p>
            <p className="text-sm font-medium text-slate-500">Inspire your network on LinkedIn.</p>
          </button>
          <button className="group rounded-3xl border bg-white p-6 text-left transition-all hover:border-indigo-200 hover:shadow-lg">
            <div className="mb-4 inline-block rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-110">
              <FiDownload className="h-6 w-6" />
            </div>
            <p className="mb-1 font-bold text-slate-800">Download certificate</p>
            <p className="text-sm font-medium text-slate-500">Save and share your achievement.</p>
          </button>
        </div>
      </div>
    </div>
  )
}
