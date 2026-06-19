import { useNavigate } from 'react-router'
import { useCooldownTimer } from '@/features/quiz/hooks/use-cooldown-timer'
import { FiX, FiAlertCircle, FiBookOpen, FiRefreshCw, FiShield } from 'react-icons/fi'

// Lôi biến này ra ngoài hàm để nó chỉ chạy 1 lần duy nhất khi load file
// Nhờ vậy, component của bạn sẽ đạt chuẩn 100% "Pure" của React.
// LƯU Ý: Khi nối API, bạn xóa biến này đi và lấy data?.quizAttempt?.cooldownUntil truyền vào hook bên dưới.
const MOCK_COOLDOWN_TARGET = new Date(Date.now() + 60000)

export function QuizResultFailPage() {
  const navigate = useNavigate()

  // Gọi hook và truyền biến ngoại lai vào
  const { formatted, isExpired } = useCooldownTimer(MOCK_COOLDOWN_TARGET)

  const score = 58
  const passingScore = 70

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl p-6 duration-500">
      <div className="mb-8 flex items-center gap-5 border-b pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-100 bg-white text-red-500 shadow-sm">
          <FiX className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Quiz failed</h1>
          <p className="mt-1 font-medium text-slate-500">
            Keep going! Review the concepts below and try again—you're improving.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Your score
              </p>
              <p className="mt-1 text-5xl font-black text-red-500">{score}%</p>
              <p className="mt-2 text-sm font-medium text-slate-500">7 / 12 correct</p>
            </div>
            <div className="border-l pl-8">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Passing score
              </p>
              <p className="mt-1 text-5xl font-black text-slate-800">{passingScore}%</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                You're {passingScore - score}% away from passing
              </p>
            </div>
            {/* Vòng tròn phần trăm daisyUI */}
            <div
              className="radial-progress bg-red-50 font-bold text-red-500"
              style={
                { '--value': score, '--size': '6rem', '--thickness': '8px' } as React.CSSProperties
              }
            >
              {score}%
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-800">Weak areas (needs review)</h3>
            <ul className="space-y-3">
              {['DOM & Events', 'React Basics'].map((area, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-4 font-bold text-red-700"
                >
                  <span className="flex items-center gap-3">
                    <FiAlertCircle className="h-5 w-5" /> {area}
                  </span>
                  <span className="text-sm font-medium opacity-80">2 incorrect</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border bg-slate-50/50 p-8">
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <div className="mt-1 rounded-full bg-green-100 p-2 text-green-600">
              <FiShield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">Good news</p>
              <p className="font-medium text-slate-500">
                Your progress is saved. You can retry the quiz anytime.
              </p>
            </div>
          </div>

          <h3 className="mb-4 text-lg font-bold text-slate-800">Recommended next steps</h3>
          <div className="mb-10 space-y-4">
            {['DOM & Events', 'React Basics'].map((topic, i) => (
              <div
                key={i}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border bg-white p-5 shadow-sm transition-colors hover:border-indigo-200"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                    <FiBookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Review: {topic}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Revisit key concepts and examples.
                    </p>
                  </div>
                </div>
                <button className="btn btn-sm rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                  Review
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
            <button
              className={`btn h-14 flex-1 rounded-xl text-base font-bold transition-all ${isExpired ? 'btn-outline border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-100' : 'cursor-not-allowed border-none bg-slate-200 text-slate-400'}`}
              disabled={!isExpired}
              onClick={() => navigate(`/quizzes/retry`)}
            >
              <FiRefreshCw
                className={`mr-2 h-5 w-5 ${isExpired ? 'group-hover:rotate-180' : 'animate-spin-slow'}`}
              />
              {isExpired ? 'Retry quiz' : `Retry in ${formatted}`}
            </button>
            <button className="btn h-14 flex-1 rounded-xl bg-slate-900 text-base font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800">
              Review weak areas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
