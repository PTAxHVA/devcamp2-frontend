import { FiCheck, FiAward, FiUnlock } from 'react-icons/fi'

export function QuizResultPassPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto max-w-5xl p-6 duration-500">
      <div className="mb-10 flex flex-col items-center border-b pb-10 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-100 bg-white text-indigo-600 shadow-lg">
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-50 opacity-75 duration-1000"></div>
          <FiCheck className="relative z-10 h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">
          Great job! You passed!
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500">
          You've completed this section and are one step closer to your goal.
        </p>

        <div className="mt-10 flex gap-16 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Your score</p>
            <p className="mt-2 text-4xl font-black text-slate-800">86%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">17 / 20 correct</p>
          </div>
          <div className="border-r border-l px-16 text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Result</p>
            <p className="mt-2 text-4xl font-black text-indigo-600">Pass</p>
            <p className="mt-1 text-sm font-medium text-indigo-600/70">Well done!</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Passing score
            </p>
            <p className="mt-2 text-4xl font-black text-slate-800">70%</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Exceeded target</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex items-center gap-8 rounded-3xl border bg-white p-8 shadow-sm">
          <div
            className="radial-progress bg-indigo-50 font-bold text-indigo-600"
            style={{ '--value': 65, '--size': '6rem', '--thickness': '8px' } as React.CSSProperties}
          >
            65%
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-slate-800">Overall progress</p>
            <p className="mt-1 mb-4 font-medium text-slate-500">13 of 20 sections completed</p>
            <progress
              className="progress progress-primary h-3 w-full"
              value="65"
              max="100"
            ></progress>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-slate-800">What you've unlocked</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                <FiUnlock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Next section unlocked</p>
                <p className="text-sm font-medium text-slate-500">Data Types & Variables</p>
              </div>
            </li>
            <li className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="rounded-lg bg-amber-200 p-2 text-amber-700">
                <FiAward className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-amber-900">Achievement earned</p>
                <p className="text-sm font-medium text-amber-700">"Consistent Learner" badge</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button className="btn h-14 rounded-xl bg-slate-900 px-10 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800">
          Continue to next section →
        </button>
      </div>
    </div>
  )
}
