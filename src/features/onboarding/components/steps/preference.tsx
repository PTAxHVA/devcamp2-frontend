import { RiArrowDownSLine } from 'react-icons/ri'
import { PREFERENCE_QUESTIONS } from '../../data/onboarding-data'
import { useWizardStore } from '../../onboarding-store'

export const StepPreferences = () => {
  const { answers, setAnswer } = useWizardStore()
  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Personalize your learning experience
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-2xl">
          Answer a few questions so VORA can tailor your roadmap, recommend the right resources, and
          help you reach your goals faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {PREFERENCE_QUESTIONS.map((q) => (
          <div key={q.id} className="flex gap-4">
            {/* Icon Block */}
            <div className="mt-1">
              <div className="w-12 h-12 rounded-xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center">
                {q.icon}
              </div>
            </div>

            {/* Content Block */}
            <div className="flex-1">
              <label className="block text-lg font-bold text-slate-900 mb-1">{q.label}</label>
              <p className="text-sm text-slate-400 mb-3">{q.desc}</p>

              <div className="relative">
                {q.type === 'select' ? (
                  <>
                    <select
                      value={(answers?.[q.id] as string) || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 cursor-pointer"
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
                    <RiArrowDownSLine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </>
                ) : (
                  <textarea
                    rows={3}
                    value={(answers?.[q.id] as string) || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-700 bg-white focus:outline-none focus:border-brand-purple-400 focus:ring-1 focus:ring-brand-purple-400 resize-none"
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
