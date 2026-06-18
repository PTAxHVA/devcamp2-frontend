import { RiCheckLine } from 'react-icons/ri'
import { steps } from '../data/onboarding-data'

interface StepperProps {
  currentStep: number
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="relative mx-auto mb-10 flex w-full max-w-700 items-center justify-between">
      <div className="absolute top-4 right-0 left-0 z-0 h-0.5 -translate-y-1/2 bg-slate-200"></div>
      <div
        className="bg-brand-purple-600 absolute top-4 left-0 z-0 h-0.5 -translate-y-1/2 transition-all duration-700 ease-in-out"
        style={{ width: `${(currentStep - 1) * 25}%` }}
      ></div>

      {steps.map((step, index) => {
        const stepNum = index + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep

        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
            <div
              className={`flex items-center justify-center rounded-full transition-all duration-500 ease-out ${
                isActive
                  ? 'border-brand-purple-600 text-brand-purple-600 shadow-brand-purple-200 -mt-1 h-10 w-10 border-2 bg-white text-lg font-bold shadow-md'
                  : isCompleted
                    ? 'bg-brand-purple-600 h-8 w-8 text-white'
                    : 'h-8 w-8 border-2 border-slate-200 bg-white font-medium text-slate-400'
              } `}
            >
              {isCompleted ? <RiCheckLine className="h-5 w-5" /> : stepNum}
            </div>
            <span
              className={`text-sm transition-colors duration-300 ${isActive ? 'text-brand-purple-600 font-bold' : isCompleted ? 'font-semibold text-slate-900' : 'font-medium text-slate-400'} `}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
