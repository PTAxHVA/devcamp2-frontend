import { RiArrowDownSLine } from 'react-icons/ri'
import { getPreferenceQuestions } from '../../data/onboarding-data'
import { useWizardStore } from '../../onboarding-store'

export const StepPreferences = () => {
  const { answers, setAnswer } = useWizardStore()
  const questions = getPreferenceQuestions(answers?.role as string | undefined)
  return (
    <div className="w-full">
      <div className="mb-10 text-left">
        <h1 className="text-text-primary mb-3 text-4xl font-bold">
          Personalize your learning experience
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg font-medium">
          Answer a few questions so VORA can tailor your roadmap, recommend the right resources, and
          help you reach your goals faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {questions.map((q) => (
          <div key={q.id} className="flex gap-4">
            {/* Icon Block */}
            <div className="mt-1">
              <div className="bg-bg-lavender text-brand-purple-600 flex h-12 w-12 items-center justify-center rounded-xl">
                {q.icon}
              </div>
            </div>

            {/* Content Block */}
            <div className="flex-1">
              <label className="text-text-primary mb-1 block text-lg font-bold">{q.label}</label>
              <p className="text-text-placeholder mb-3 text-sm">{q.desc}</p>

              <div className="relative">
                {q.type === 'select' ? (
                  <>
                    <select
                      value={(answers?.[q.id] as string) || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      className="focus:border-brand-purple-400 focus:ring-brand-purple-400 border-border-soft text-text-secondary bg-bg-card w-full cursor-pointer appearance-none rounded-lg border px-4 py-3 focus:ring-1 focus:outline-none"
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
                    <RiArrowDownSLine className="text-text-placeholder pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2" />
                  </>
                ) : (
                  <textarea
                    rows={3}
                    value={(answers?.[q.id] as string) || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="focus:border-brand-purple-400 focus:ring-brand-purple-400 border-border-soft text-text-secondary bg-bg-card w-full resize-none rounded-lg border px-4 py-3 focus:ring-1 focus:outline-none"
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
