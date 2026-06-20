import { goals } from '../../data/onboarding-data'

interface StepGoalProps {
  selectedGoal?: string
  setSelectedGoal: (id: string) => void
}

export const StepGoal = ({ selectedGoal, setSelectedGoal }: StepGoalProps) => {
  return (
    <div className="mb-20 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => (
        <div
          key={goal.id}
          onClick={() => setSelectedGoal(goal.id)}
          className={`relative flex min-h-70 cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-8 text-center transition-all duration-300 ${
            selectedGoal === goal.id
              ? 'border-brand-purple-300 bg-bg-lavender/10 ring-brand-purple-300 -translate-y-1 border-2 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2'
              : 'border-border-soft hover:border-border-input border shadow-sm hover:-translate-y-1 hover:shadow-xl'
          } `}
        >
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${selectedGoal === goal.id ? 'border-brand-purple-600' : 'border-border-input'} `}
            >
              {selectedGoal === goal.id && (
                <div className="bg-brand-purple-600 h-2.5 w-2.5 rounded-full"></div>
              )}
            </div>
          </div>

          <div className="mt-4 mb-6 flex items-center justify-center transition-transform duration-300">
            <div className="bg-bg-lavender rounded-2xl p-4">{goal.icon}</div>
          </div>

          <h3 className="text-text-primary mb-2 text-lg font-bold">{goal.title}</h3>
          <p className="text-text-muted text-sm leading-relaxed">{goal.desc}</p>
        </div>
      ))}
    </div>
  )
}
