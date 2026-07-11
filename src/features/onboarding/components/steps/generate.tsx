import { useEffect, useState } from 'react'
import { RiArrowRightLine, RiKey2Line, RiLightbulbFlashLine, RiSearchLine } from 'react-icons/ri'
import { useWizardStore } from '../../onboarding-store'
import { useRoadmapSuggestion } from '../../hooks/use-roadmap-suggestion'

/** Shown when the suggestion request fails — the flow continues with the default order. */
export const DEFAULT_REASON =
  'VORA has arranged your roadmap to fit your goals and experience. You can review and customize it in the next step.'

/** Keep the working animation on screen at least this long so the reveal doesn't flash. */
const MIN_DWELL_MS = 2200

interface StepGeneratingProps {
  onContinue: () => void
  /** Test knob — shortens the minimum dwell so unit tests don't sleep. */
  minDwellMs?: number
}

const WORKING_STEPS = [
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
    title: 'AI is ordering your topics',
    desc: 'Sequencing the roadmap around your goals, level, and pace.',
    icon: <RiKey2Line className="h-7 w-7" />,
  },
]

const WorkingState = () => (
  <div className="animate-in fade-in mt-8 flex w-full flex-col items-center gap-10 duration-700">
    <div className="max-w-xl text-center">
      <h1 className="mb-4 text-3xl leading-tight font-bold text-[#0B1528] sm:text-4xl md:text-5xl">
        Personalizing your roadmap
      </h1>
      <p className="text-text-muted text-lg">
        VORA's AI is arranging your topics around your answers — this only takes a moment.
      </p>
    </div>

    <div className="flex w-full max-w-xl flex-col gap-5">
      {WORKING_STEPS.map((step) => (
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

/**
 * Step 6 — the personalization moment. While the real AI suggestion request is
 * in flight (see useRoadmapSuggestion) it shows an honest working state, then
 * reveals WHY the AI ordered the topics this way plus the order itself. The
 * learner continues to the gate at their own pace; Continue pins the suggestion
 * into the wizard store so enroll can reuse the exact AI order. If the request
 * failed, a friendly default message is shown and enroll simply falls back to
 * the server's default order — the flow is never blocked by AI.
 */
export const StepGenerating = ({ onContinue, minDwellMs = MIN_DWELL_MS }: StepGeneratingProps) => {
  const setSuggestion = useWizardStore((s) => s.setSuggestion)
  const { data, isPending } = useRoadmapSuggestion()

  const [dwellDone, setDwellDone] = useState(minDwellMs <= 0)
  useEffect(() => {
    if (minDwellMs <= 0) return
    const timer = setTimeout(() => setDwellDone(true), minDwellMs)
    return () => clearTimeout(timer)
  }, [minDwellMs])

  if (isPending || !dwellDone) return <WorkingState />

  // Server-side degrade (Gemini down → source 'fallback') carries an internal
  // notice as its explanation — show the friendly default copy instead.
  const aiBusy = data?.source === 'fallback'
  const explanation =
    data && !aiBusy && data.explanation.trim().length > 0 ? data.explanation : DEFAULT_REASON

  const handleContinue = () => {
    // Pin the suggestion (or its absence) for the gate's enroll call.
    setSuggestion(data ?? null)
    onContinue()
  }

  return (
    <div className="animate-in fade-in mx-auto mt-8 flex w-full max-w-2xl flex-col items-center gap-8 duration-700">
      <div className="text-center">
        <div className="bg-bg-lavender mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full">
          <span className="text-4xl">✨</span>
        </div>
        <h1 className="text-text-primary mb-3 text-3xl leading-tight font-bold sm:text-4xl">
          Here's your personalized plan
        </h1>
        <p className="text-text-muted text-lg">
          Review your topic order below — you can still customize everything later.
        </p>
      </div>

      <div className="border-brand-purple-200 bg-bg-lavender w-full rounded-2xl border-2 p-6">
        <p className="text-brand-purple-600 mb-2 text-sm font-bold tracking-wide uppercase">
          Why this order
        </p>
        <p className="text-text-primary text-base leading-relaxed">{explanation}</p>
        {aiBusy && (
          <p className="text-text-muted mt-2 text-sm">
            AI personalization is busy right now — showing this roadmap's standard order.
          </p>
        )}
      </div>

      {data && data.topics.length > 0 && (
        <div className="border-border-soft bg-bg-card w-full rounded-2xl border p-6 shadow-sm">
          <p className="text-text-primary mb-4 text-sm font-bold tracking-wide uppercase">
            Your learning order
          </p>
          <ol className="flex flex-wrap gap-2">
            {data.topics.map((topic, index) => (
              <li
                key={topic.id}
                className="border-border-soft bg-bg-section text-text-secondary flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
              >
                <span className="text-brand-purple-600 font-bold">{index + 1}</span>
                {topic.name}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button
        onClick={handleContinue}
        className="btn focus-visible:ring-brand-purple-300 h-12 rounded-xl border-none bg-[#0B1528] px-10 text-base font-semibold text-white transition-all duration-200 hover:bg-[#15233e] hover:shadow-lg focus-visible:ring-2 active:scale-95"
      >
        Continue
        <RiArrowRightLine className="ml-2 h-5 w-5" />
      </button>
    </div>
  )
}
