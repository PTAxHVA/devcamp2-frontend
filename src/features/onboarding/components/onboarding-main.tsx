import { useState, useEffect } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { useNavigate } from 'react-router'
import { NavBar, Footer } from '@/features/onboarding/components'
import { Stepper } from './stepper'
import {
  StepIntro,
  StepRole,
  StepGoal,
  StepLevel,
  StepPreferences,
  StepLearningPath,
  StepGenerating,
} from './steps'
import StepCustomize from './steps/customize'
import { StepGate } from './steps/gate'
import { steps, PREFERENCE_QUESTIONS, LEARNING_PATH_KEYS } from '../data/onboarding-data'
import { useWizardStore } from '../onboarding-store'
import { useCompleteOnboarding } from '../hooks/use-complete-onboarding'

const OnboardingMain = () => {
  const { step: currentStep, answers, setAnswer, nextStep, prevStep, goToStep } = useWizardStore()
  const completeOnboarding = useCompleteOnboarding()
  const navigate = useNavigate()
  const [direction, setDirection] = useState('next')
  const [subStep, setSubStep] = useState(1)

  // Lưu lại step+substep lúc bị bấm Continue mà chưa hợp lệ.
  // Không dùng useEffect để reset — so sánh trực tiếp lúc render,
  // tự động hết hiệu lực khi currentStep/subStep đổi, tránh setState trong effect.
  const [errorStepKey, setErrorStepKey] = useState<string | null>(null)
  const showValidationError = errorStepKey === `${currentStep}-${subStep}`

  useEffect(() => {
    if (currentStep === 6) {
      const timer = setTimeout(() => {
        setDirection('next')
        goToStep(7)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, goToStep])

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 2:
        return !!answers?.role
      case 3:
        return !!answers?.goal
      case 4:
        return !!answers?.level
      case 5:
        if (subStep === 1) {
          return PREFERENCE_QUESTIONS.every((q) => {
            if (q.required === false) return true
            const val = answers?.[q.id]
            return typeof val === 'string' ? val.trim().length > 0 : !!val
          })
        }
        return LEARNING_PATH_KEYS.every((key) => !!answers?.[key])
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      setErrorStepKey(`${currentStep}-${subStep}`)
      return
    }
    setErrorStepKey(null)

    if (currentStep === 5 && subStep === 1) {
      setDirection('next')
      setSubStep(2)
    } else if (currentStep === 5 && subStep === 2) {
      setDirection('next')
      nextStep()
      setSubStep(1)
    } else if (currentStep < steps.length) {
      setDirection('next')
      nextStep()
      setSubStep(1)
    }
  }

  const handleBack = () => {
    setErrorStepKey(null)
    if (currentStep === 8) {
      setDirection('back')
      goToStep(7)
    } else if (currentStep === 7) {
      // Gate: back to the last user-input step (LearningPath), before AI generation.
      setDirection('back')
      goToStep(5)
      setSubStep(2)
    } else if (currentStep === 5 && subStep === 2) {
      setDirection('back')
      setSubStep(1)
    } else if (currentStep > 1) {
      setDirection('back')
      prevStep()
      if (currentStep - 1 === 5) {
        setSubStep(2)
      }
    }
  }

  return (
    <div className="text-text-primary flex min-h-screen flex-col bg-white font-sans">
      <NavBar />
      <main className="relative mx-auto flex min-h-screen w-full max-w-300 flex-1 flex-col overflow-x-hidden px-6 py-12">
        <div className="pointer-events-none fixed top-[-10%] left-[-5%] -z-10 h-125 w-125 rounded-full bg-indigo-200/20 blur-[120px]"></div>
        <div className="pointer-events-none fixed right-[-5%] bottom-[-10%] -z-10 h-150 w-150 rounded-full bg-purple-200/20 blur-[150px]"></div>

        <style>{`
          @keyframes slideInRight { 0% { opacity: 0; transform: translateX(80px); } 100% { opacity: 1; transform: translateX(0); } }
          @keyframes slideInLeft { 0% { opacity: 0; transform: translateX(-80px); } 100% { opacity: 1; transform: translateX(0); } }
          @keyframes simpleFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          .slide-next { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .slide-back { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .fade-only { animation: simpleFadeIn 0.4s ease-in-out forwards; }
        `}</style>

        {currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && (
          <div className="mb-10 w-full">
            <Stepper currentStep={currentStep} />
          </div>
        )}

        {currentStep > 1 && currentStep < 5 && (
          <div key={`heading-${currentStep}`} className="fade-only mb-10 text-center">
            <h1 className="text-text-primary mb-4 text-4xl font-bold">
              {currentStep === 2
                ? "What's your starting point?"
                : currentStep === 3
                  ? "What's your main goal?"
                  : 'What’s your current level?'}
            </h1>
            <p className="text-text-muted text-lg font-medium">
              {currentStep === 2
                ? 'Choose the role that best matches your goals.'
                : currentStep === 3
                  ? 'This helps us personalize your roadmap and resources.'
                  : 'This helps VORA tailor topics to your experience.'}
            </p>
          </div>
        )}

        <div
          key={`grid-${currentStep}-${subStep}`}
          className={direction === 'next' ? 'slide-next' : 'slide-back'}
        >
          {currentStep === 1 && <StepIntro onStart={() => goToStep(2)} />}

          {currentStep === 2 && (
            <StepRole
              selectedRole={answers?.role as string | undefined}
              setSelectedRole={(val) => setAnswer('role', val)}
            />
          )}

          {currentStep === 3 && (
            <StepGoal
              selectedGoal={answers?.goal as string | undefined}
              setSelectedGoal={(val) => setAnswer('goal', val)}
            />
          )}

          {currentStep === 4 && (
            <StepLevel
              selectedLevel={answers?.level as string | undefined}
              setSelectedLevel={(val) => setAnswer('level', val)}
            />
          )}

          {currentStep === 5 && subStep === 1 && <StepPreferences />}
          {currentStep === 5 && subStep === 2 && <StepLearningPath />}
          {currentStep === 6 && <StepGenerating />}
          {currentStep === 7 && (
            <StepGate
              onAccept={() => completeOnboarding.mutate()}
              onCustomize={() => {
                setDirection('next')
                goToStep(8)
              }}
              onChooseAnother={() => navigate('/roadmaps/browse')}
              isSubmitting={completeOnboarding.isPending}
            />
          )}
          {currentStep === 8 && (
            <StepCustomize
              onComplete={() => completeOnboarding.mutate()}
              isSubmitting={completeOnboarding.isPending}
            />
          )}
        </div>

        {currentStep !== 1 && (
          <div className="border-border-soft/60 mt-16 flex flex-col border-t pt-8">
            {showValidationError && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && (
              <p className="text-error-text mb-4 text-right text-sm font-medium">
                Please complete this step before continuing.
              </p>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="btn btn-ghost border-border-soft text-text-secondary hover:bg-bg-section h-12 rounded-xl border px-8 text-base font-semibold transition-all active:scale-95"
              >
                <RiArrowLeftLine className="mr-2 h-5 w-5" /> Back
              </button>
              {currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && (
                <button
                  onClick={handleNext}
                  className="btn h-12 rounded-xl border-none bg-[#0B1528] px-10 text-base font-semibold text-white transition-all hover:bg-[#15233e] hover:shadow-lg active:scale-95"
                >
                  {currentStep === 5 && subStep === 2 ? 'Personalize Your Roadmap' : 'Continue'}
                  <RiArrowRightLine className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default OnboardingMain
