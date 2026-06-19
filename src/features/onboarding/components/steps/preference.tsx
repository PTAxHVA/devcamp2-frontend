import { RiArrowDownSLine } from 'react-icons/ri'
import { PREFERENCE_QUESTIONS } from '../../data/onboarding-data'
import { useWizardStore } from '../../onboarding-store'

export const StepPreferences = () => {
  const { answers, setAnswer } = useWizardStore()
  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="mb-3 text-4xl font-bold text-slate-900">
          Personalize your learning experience
        </h1>
        <p className="max-w-2xl text-lg font-medium text-slate-600">
          Answer a few questions so VORA can tailor your roadmap, recommend the right resources, and
          help you reach your goals faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {PREFERENCE_QUESTIONS.map((q) => (
          <div key={q.id} className="flex gap-4">
            {/* Icon Block */}
            <div className="mt-1">
              <div className="bg-brand-purple-50 text-brand-purple-600 flex h-12 w-12 items-center justify-center rounded-xl">
                {q.icon}
              </div>
            </div>

            {/* Content Block */}
            <div className="flex-1">
              <label className="mb-1 block text-lg font-bold text-slate-900">{q.label}</label>
              <p className="mb-3 text-sm text-slate-400">{q.desc}</p>

              <div className="relative">
                {q.type === 'select' ? (
                  <>
                    <select
                      value={(answers?.[q.id] as string) || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      className="focus:border-brand-purple-400 focus:ring-brand-purple-400 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:ring-1 focus:outline-none"
                    >
                      <option value="" disabled>
                        {q.placeholder}
                      </option>
                      {q.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <RiArrowDownSLine className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  </>
                ) : (
                  <textarea
                    rows={3}
                    value={(answers?.[q.id] as string) || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="focus:border-brand-purple-400 focus:ring-brand-purple-400 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:ring-1 focus:outline-none"
                  ></textarea>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
