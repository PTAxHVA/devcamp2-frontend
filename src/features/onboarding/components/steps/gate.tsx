import { RiCheckLine, RiListSettingsLine, RiSearchLine, RiLoader4Line } from 'react-icons/ri'
import { useWizardStore } from '../../onboarding-store'
import { useBrowseRoadmaps } from '@/features/roadmap/hooks/use-browse-roadmaps'
import { matchMasterRoadmap } from '../../lib/map-questionnaire'

interface StepGateProps {
  onAccept: () => void
  onCustomize: () => void
  onChooseAnother: () => void
  isSubmitting: boolean
}

export function StepGate({ onAccept, onCustomize, onChooseAnother, isSubmitting }: StepGateProps) {
  const role = useWizardStore((s) => s.answers?.role as string | undefined)
  const { data: roadmaps } = useBrowseRoadmaps()
  const matched = matchMasterRoadmap(role, roadmaps ?? [])
  // Only use the resolved roadmap name; while the catalog loads fall through to the
  // neutral "learning" label below rather than showing the raw lowercase role id (L7).
  const roadmapName = matched?.roleName

  return (
    <div className="animate-in fade-in mx-auto mt-8 flex w-full max-w-2xl flex-col items-center gap-10 duration-700">
      <div className="text-center">
        <div className="bg-bg-lavender mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full">
          <span className="text-4xl">✨</span>
        </div>
        <h1 className="text-text-primary mb-3 text-4xl leading-tight font-bold">
          Your roadmap is ready!
        </h1>
        <p className="text-text-muted text-lg">
          We've built a personalized {roadmapName ?? 'learning'} path for you.
          <br />
          What would you like to do next?
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        {/* Accept */}
        <button
          onClick={onAccept}
          disabled={isSubmitting}
          className="border-brand-purple-200 bg-bg-lavender hover:bg-brand-purple-100 flex w-full items-center gap-5 rounded-2xl border-2 px-6 py-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="bg-brand-purple-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white">
            {isSubmitting ? (
              <RiLoader4Line className="h-6 w-6 animate-spin" />
            ) : (
              <RiCheckLine className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="text-text-primary text-base font-bold">
              {isSubmitting ? 'Enrolling…' : 'Accept & Start Learning'}
            </p>
            <p className="text-text-muted text-sm">Use the suggested roadmap and jump in now.</p>
          </div>
        </button>

        {/* Customize */}
        <button
          onClick={onCustomize}
          disabled={isSubmitting}
          className="border-border-soft hover:bg-bg-section flex w-full items-center gap-5 rounded-2xl border-2 px-6 py-5 text-left transition-all disabled:opacity-50"
        >
          <div className="bg-bg-section flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <RiListSettingsLine className="text-text-secondary h-6 w-6" />
          </div>
          <div>
            <p className="text-text-primary text-base font-bold">Customize First</p>
            <p className="text-text-muted text-sm">
              Add, remove, or reorder topics before you start.
            </p>
          </div>
        </button>

        {/* Choose another */}
        <button
          onClick={onChooseAnother}
          disabled={isSubmitting}
          className="border-border-soft hover:bg-bg-section flex w-full items-center gap-5 rounded-2xl border-2 px-6 py-5 text-left transition-all disabled:opacity-50"
        >
          <div className="bg-bg-section flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <RiSearchLine className="text-text-secondary h-6 w-6" />
          </div>
          <div>
            <p className="text-text-primary text-base font-bold">Choose a Different Roadmap</p>
            <p className="text-text-muted text-sm">Browse all available roadmaps instead.</p>
          </div>
        </button>
      </div>
    </div>
  )
}
