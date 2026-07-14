import { useWizardStore } from '../../onboarding-store'
import { buildPathSections } from './learning-path-sections'

export const StepLearningPath = () => {
  const { answers, setAnswer } = useWizardStore()
  const role = answers?.role as string | undefined
  const sections = buildPathSections(role, answers, setAnswer)

  return (
    <div className="w-full">
      <div className="mb-12 text-left">
        <h1 className="text-text-primary mb-3 text-4xl font-bold">Choose your learning path</h1>
        <p className="text-text-secondary max-w-2xl text-lg font-medium">
          Tell us your preferences so we can tailor your roadmap to match your goals.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-bg-lavender text-brand-purple-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                {section.id}
              </div>
              <div>
                <h2 className="text-text-primary text-xl font-bold">{section.title}</h2>
                <p className="text-text-muted text-sm">{section.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:pl-14 lg:grid-cols-3">
              {section.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => section.setState(option.id)}
                  className={`bg-bg-card relative flex min-h-30 cursor-pointer items-center gap-4 rounded-2xl p-6 transition-all duration-200 ${
                    section.state === option.id
                      ? 'border-brand-purple-300 bg-bg-lavender/10 ring-brand-purple-300 -translate-y-1 border-2 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2'
                      : 'border-border-soft hover:border-border-input border shadow-sm hover:-translate-y-1 hover:shadow-md'
                  } `}
                >
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${section.state === option.id ? 'border-brand-purple-600' : 'border-border-input'}`}
                    >
                      {section.state === option.id && (
                        <div className="bg-brand-purple-600 h-2.5 w-2.5 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">{option.icon}</div>
                  <div className="flex-1 pr-4">
                    <h3 className="text-text-primary mb-1 text-lg leading-tight font-bold">
                      {option.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed">{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
