import { RiCheckLine } from 'react-icons/ri'
import { steps } from '../data/onboardingData'

interface StepperProps {
  currentStep: number
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="w-full max-w-700 mx-auto mb-10 flex items-center justify-between relative">
      <div className="absolute left-0 right-0 top-4 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
      <div
        className="absolute left-0 top-4 -translate-y-1/2 h-0.5 bg-brand-purple-600 z-0 transition-all duration-700 ease-in-out"
        style={{ width: `${(currentStep - 1) * 25}%` }}
      ></div>

      {steps.map((step, index) => {
        const stepNum = index + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep

        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-4">
            <div
              className={`rounded-full flex items-center justify-center transition-all duration-500 ease-out
                ${
                  isActive
                    ? 'w-10 h-10 -mt-1 bg-white border-brand-purple-600 border-2 text-brand-purple-600 text-lg font-bold shadow-md shadow-brand-purple-200'
                    : isCompleted
                      ? 'w-8 h-8 bg-brand-purple-600 text-white'
                      : 'w-8 h-8 bg-white border-slate-200 border-2 text-slate-400 font-medium'
                }
              `}
            >
              {isCompleted ? <RiCheckLine className="w-5 h-5" /> : stepNum}
            </div>
            <span
              className={`text-sm transition-colors duration-300 
                ${isActive ? 'font-bold text-brand-purple-600' : isCompleted ? 'font-semibold text-slate-900' : 'font-medium text-slate-400'}
              `}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
