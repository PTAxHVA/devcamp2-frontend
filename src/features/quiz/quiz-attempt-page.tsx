import { FiClock, FiZap, FiBookOpen } from 'react-icons/fi'
import { useQuizTimer } from '@/features/quiz/hooks/use-quiz-timer'

interface QuizAttemptProps {
  question?: { type: 'mcq' | 'fill' | 'code'; content: string }
  total?: number
  current?: number
}

export function QuizAttemptPage({
  question = { type: 'mcq', content: '' },
  total = 5,
  current = 2,
}: QuizAttemptProps) {
  const isCodeType = question?.type === 'code'

  // Giả lập thời gian làm bài là 10 phút (600 giây)
  const { formatted, isUrgent } = useQuizTimer(600)

  return (
    <div className="fade-in mx-auto flex h-full max-w-7xl flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <button className="mb-2 flex items-center font-bold text-indigo-600">
            ← Back to lesson
          </button>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-800">
            Quiz <span className="badge badge-primary badge-outline font-bold">Theory</span>
          </h1>
        </div>
        {!isCodeType && (
          <p className="rounded-full bg-indigo-50 px-4 py-1 font-bold text-indigo-600">
            Question {current} of {total}
          </p>
        )}
      </div>

      <progress
        className="progress progress-primary mb-8 h-2 w-full"
        value={current}
        max={total}
      ></progress>

      <div
        className={`grid flex-1 gap-8 ${isCodeType ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}
      >
        {/* Main Content Area */}
        <div className={isCodeType ? 'col-span-1' : 'col-span-2 flex flex-col'}>
          {isCodeType ? (
            // UI Câu hỏi dạng Code
            <div className="mb-6 h-full overflow-y-auto rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Reverse a String</h2>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-1 font-mono font-bold ${isUrgent ? 'animate-pulse bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'}`}
                >
                  <FiClock /> {formatted}
                </div>
              </div>

              <h3 className="mt-6 mb-2 text-sm font-bold">Problem</h3>
              <p className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
                Given a string <code className="rounded bg-slate-200 px-1 text-red-500">s</code>,
                return the string reversed.
              </p>

              <h3 className="mt-6 mb-2 text-sm font-bold">Requirements</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Do not use any built-in reverse functions.</li>
                <li>The input string will consist of printable ASCII characters.</li>
              </ul>

              <h3 className="mt-6 mb-2 text-sm font-bold">Example</h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs font-bold text-slate-500">Input</p>
                  <div className="flex justify-between rounded-lg border bg-slate-50 p-3 font-mono text-sm">
                    "hello" <button>📋</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // UI Câu hỏi dạng MCQ
            <div className="flex-1 rounded-2xl border bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-800">
                Which of the following is a key benefit of using React components?
              </h2>
              <p className="mb-4 text-sm text-slate-500">Select the best answer.</p>

              <div className="space-y-3">
                {[
                  'They make code reusable and easier to maintain.',
                  'They automatically improve network performance.',
                  'They allow databases to run faster.',
                  'They reduce the need for version control.',
                ].map((opt, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    <input type="radio" name="mcq" className="radio radio-primary" />
                    <span className="font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between border-t pt-6">
                <button className="btn btn-ghost font-bold text-indigo-600">← Previous</button>
                <button className="btn h-12 rounded-xl bg-slate-900 px-8 text-white">
                  Submit answer →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cột Editor (cho dạng Code) */}
        {isCodeType && (
          <div className="col-span-1 flex h-[600px] flex-col overflow-hidden rounded-2xl border bg-white shadow-sm lg:h-auto">
            <div className="flex items-center justify-between border-b bg-slate-50 p-3">
              <span className="text-sm font-bold text-slate-700">Your code</span>
              <select className="select select-bordered select-xs w-32 bg-white">
                <option>Python 3</option>
                <option>JavaScript</option>
              </select>
            </div>
            <textarea
              className="h-full w-full resize-none p-4 font-mono text-sm text-slate-800 focus:outline-none"
              placeholder="# Write your solution here..."
            ></textarea>
            <div className="flex justify-end gap-3 border-t bg-slate-50 p-4">
              <button className="btn btn-outline border-slate-300 bg-white text-slate-700 hover:bg-slate-100">
                Save draft
              </button>
              <button className="btn bg-slate-900 text-white hover:bg-slate-800">
                Submit solution →
              </button>
            </div>
          </div>
        )}

        {/* Cột Sidebar (cho dạng MCQ) */}
        {!isCodeType && (
          <div className="col-span-1 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="mb-6 font-bold text-slate-800">Quiz summary</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-2 ${isUrgent ? 'animate-pulse bg-red-100 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}
                  >
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Time remaining
                    </p>
                    <p
                      className={`text-2xl font-black ${isUrgent ? 'text-red-600' : 'text-slate-800'}`}
                    >
                      {formatted}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-500">
                    <FiZap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Score to pass
                    </p>
                    <p className="text-2xl font-black text-slate-800">70%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
                Current topic
              </p>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                  <FiBookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">React Components</p>
                  <p className="mt-1 text-xs text-slate-500">Web Fundamentals</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
