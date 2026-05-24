import { goals } from '../../data/onboardingData'

interface StepGoalProps {
  selectedGoal: string
  setSelectedGoal: (id: string) => void
}

export const StepGoal = ({ selectedGoal, setSelectedGoal }: StepGoalProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 ">
      {goals.map((goal) => (
        <div
          key={goal.id}
          onClick={() => setSelectedGoal(goal.id)}
          className={`relative justify-center cursor-pointer rounded-2xl p-8 bg-white transition-all duration-300 flex flex-col items-center text-center min-h-70 
            ${
              selectedGoal === goal.id
                ? 'border-2 border-brand-purple-300 bg-brand-purple-50/10 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2 ring-brand-purple-300 -translate-y-1'
                : 'border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }
          `}
        >
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${selectedGoal === goal.id ? 'border-brand-purple-600' : 'border-slate-300'}
            `}
            >
              {selectedGoal === goal.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-purple-600"></div>
              )}
            </div>
          </div>

          <div className="mb-6 mt-4 flex items-center justify-center transition-transform duration-300">
            <div className="p-4 bg-brand-purple-50 rounded-2xl">{goal.icon}</div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">{goal.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{goal.desc}</p>
        </div>
      ))}
    </div>
  )
}
