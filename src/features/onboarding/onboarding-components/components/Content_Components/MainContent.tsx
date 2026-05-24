import { useState, useEffect } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

import { Stepper } from './Stepper'
import {
  StepIntro,
  StepRole,
  StepGoal,
  StepLevel,
  StepPreferences,
  StepLearningPath,
  StepGenerating,
  StepCustomize,
} from './Step_Page'
import { steps } from './onboardingData'

export const MainContent = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('backend')
  const [selectedGoal, setSelectedGoal] = useState('school')
  const [selectedLevel, setSelecteLevel] = useState('beginner')

  const [direction, setDirection] = useState('next')
  const [subStep, setSubStep] = useState(1)

  useEffect(() => {
    if (currentStep === 6) {
      const timer = setTimeout(() => {
        setDirection('next')
        setCurrentStep(7)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleNext = () => {
    if (currentStep === 5 && subStep === 1) {
      setDirection('next')
      setSubStep(2)
    } else if (currentStep === 5 && subStep === 2) {
      setDirection('next')
      setCurrentStep(6)
      setSubStep(1)
    } else if (currentStep < steps.length) {
      setDirection('next')
      setCurrentStep((prev) => prev + 1)
      setSubStep(1)
    }
  }

  const handleBack = () => {
    if (currentStep === 7) {
      setDirection('back')
      setCurrentStep(2)
      setSubStep(1)
    } else if (currentStep === 5 && subStep === 2) {
      setDirection('back')
      setSubStep(1)
    } else if (currentStep > 1) {
      setDirection('back')
      setCurrentStep((prev) => prev - 1)

      if (currentStep - 1 === 5) {
        setSubStep(2)
      }
    }
  }

  return (
    <main className="relative flex-1 flex flex-col max-w-325 w-full mx-auto px-6 py-12 overflow-x-hidden min-h-screen">
      <div className="fixed top-[-10%] left-[-5%] w-125 h-125 bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-150 h-150 bg-purple-200/20 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <style>{`
        @keyframes slideInRight { 0% { opacity: 0; transform: translateX(80px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-80px); } 100% { opacity: 1; transform: translateX(0); } }
        @keyframes simpleFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        .slide-next { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-back { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-only { animation: simpleFadeIn 0.4s ease-in-out forwards; }
      `}</style>

      {currentStep !== 6 && (
        <div className="mb-10 w-full">
          <Stepper currentStep={currentStep === 7 ? 6 : currentStep} />
        </div>
      )}

      {currentStep > 1 && currentStep < 5 && (
        <div key={`heading-${currentStep}`} className="text-center mb-10 fade-only">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {currentStep === 2
              ? "What's your starting point?"
              : currentStep === 3
                ? "What's your main goal?"
                : 'What’s your current level?'}
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            {currentStep === 2
              ? 'Choose the role that best matches your goals.'
              : currentStep === 3
                ? 'This helps us personalize your roadmap and resources.'
                : 'This helps VORA tailor topics to your experience.'}
          </p>
        </div>
      )}

      {/* GRIDS NỘI DUNG */}
      <div
        key={`grid-${currentStep}-${subStep}`}
        className={direction === 'next' ? 'slide-next' : 'slide-back'}
      >
        {currentStep === 1 && <StepIntro onStart={() => setCurrentStep(2)} />}
        {currentStep === 2 && (
          <StepRole selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        )}
        {currentStep === 3 && (
          <StepGoal selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />
        )}
        {currentStep === 4 && (
          <StepLevel selectedLevel={selectedLevel} setSelectedLevel={setSelecteLevel} />
        )}
        {currentStep === 5 && subStep === 1 && <StepPreferences />}
        {currentStep === 5 && subStep === 2 && <StepLearningPath />}
        {currentStep === 6 && <StepGenerating />}
        {currentStep === 7 && <StepCustomize />}
      </div>
      {currentStep !== 1 && (
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-200/60">
          <button
            onClick={handleBack}
            className="btn btn-ghost px-8 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-base h-12 transition-all active:scale-95"
          >
            <RiArrowLeftLine className="mr-2 w-5 h-5" /> Back
          </button>
          {currentStep !== 6 && currentStep !== 7 && (
            <button
              onClick={handleNext}
              className="btn px-10 rounded-xl bg-[#0B1528] hover:bg-[#15233e] text-white border-none font-semibold text-base h-12 transition-all active:scale-95 hover:shadow-lg"
            >
              {currentStep === 5 && subStep === 2 ? 'Generate Your Roadmap' : 'Continue'}
              <RiArrowRightLine className="ml-2 w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </main>
  )
}
