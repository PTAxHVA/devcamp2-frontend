import { RiSearchLine, RiLightbulbFlashLine, RiKey2Line } from 'react-icons/ri'

/**
 * Brief transition shown while the wizard advances to the ready screen. It does not
 * claim live AI work (the roadmap is built when the learner Accepts on the next
 * step) and shows no fabricated preview — just an honest "setting up" state.
 */
export const StepGenerating = () => {
  const processSteps = [
    {
      id: 1,
      title: 'Reviewing your answers',
      desc: 'Your goals, experience, and preferences.',
      icon: <RiSearchLine className="h-7 w-7" />,
    },
    {
      id: 2,
      title: 'Matching the right roadmap',
      desc: 'The skills and resources that fit your goals.',
      icon: <RiLightbulbFlashLine className="h-7 w-7" />,
    },
    {
      id: 3,
      title: 'Ordering topics and milestones',
      desc: 'Structuring the roadmap in an effective learning order.',
      icon: <RiKey2Line className="h-7 w-7" />,
    },
  ]

  return (
    <div className="animate-in fade-in mt-8 flex w-full flex-col items-center gap-10 duration-700">
      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-4xl leading-tight font-bold text-[#0B1528] md:text-5xl">
          Preparing your personalized roadmap
        </h1>
        <p className="text-text-muted text-lg">
          Hang tight while we set up your learning path — this only takes a moment.
        </p>
      </div>

      <div className="flex w-full max-w-xl flex-col gap-5">
        {processSteps.map((step) => (
          <div
            key={step.id}
            className="border-border-soft bg-bg-card flex items-center gap-6 rounded-2xl border p-6 shadow-sm"
          >
            <div className="bg-bg-lavender text-brand-purple-600 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
              {step.icon}
            </div>
            <div className="flex-1 pr-4">
              <h3 className="text-text-primary mb-1 text-lg font-bold">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
            <span className="loading loading-spinner loading-md text-brand-purple-500 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
