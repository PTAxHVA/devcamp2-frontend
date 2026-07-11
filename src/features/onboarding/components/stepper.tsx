import { RiCheckLine } from 'react-icons/ri'
import { steps } from '../data/onboarding-data'

interface StepperProps {
  currentStep: number
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="mx-auto w-full max-w-700">
      {/* Compact caption for narrow screens where per-step labels don't fit —
          without it, the 5th/6th steps used to get clipped off the right edge. */}
      <p className="text-brand-purple-600 mb-3 text-center text-sm font-semibold sm:hidden">
        Step {currentStep} of {steps.length} · {steps[currentStep - 1]}
      </p>

      <div className="relative flex w-full items-center justify-between">
        <div className="bg-border-soft absolute top-4 right-0 left-0 z-0 h-0.5 -translate-y-1/2"></div>
        <div
          className="bg-brand-purple-600 absolute top-4 left-0 z-0 h-0.5 -translate-y-1/2 transition-[width] duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const stepNum = index + 1
          const isActive = stepNum === currentStep
          const isCompleted = stepNum < currentStep

          return (
            <div
              key={step}
              className="bg-bg-card relative z-10 flex flex-col items-center gap-2 px-1 sm:px-4"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-colors duration-200 ease-out ${
                  isActive
                    ? 'border-brand-purple-600 text-brand-purple-600 shadow-brand-purple-200 bg-bg-card -mt-1 h-10 w-10 border-2 text-lg font-bold shadow-md'
                    : isCompleted
                      ? 'bg-brand-purple-600 h-8 w-8 text-white'
                      : 'border-border-soft text-text-placeholder bg-bg-card h-8 w-8 border-2 font-medium'
                } `}
              >
                {isCompleted ? <RiCheckLine className="h-5 w-5" /> : stepNum}
              </div>
              <span
                className={`hidden text-sm transition-colors duration-200 sm:block ${isActive ? 'text-brand-purple-600 font-bold' : isCompleted ? 'text-text-primary font-semibold' : 'text-text-placeholder font-medium'} `}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
