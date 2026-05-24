import { RiTimeLine } from 'react-icons/ri'
import { roles } from '../../data/onboardingData'

interface StepRoleProps {
  selectedRole: string
  setSelectedRole: (id: string) => void
}

export const StepRole = ({ selectedRole, setSelectedRole }: StepRoleProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
      {roles.map((role) => (
        <div
          key={role.id}
          onClick={() => setSelectedRole(role.id)}
          className={`relative cursor-pointer rounded-2xl p-10 bg-white transition-all duration-300 flex flex-col min-h-80
            ${
              selectedRole === role.id
                ? 'border-2 border-brand-purple-300 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2 ring-brand-purple-300 -translate-y-1'
                : 'border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }
          `}
        >
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${selectedRole === role.id ? 'border-brand-purple-600' : 'border-slate-300'}
            `}
            >
              {selectedRole === role.id && (
                <div className="w-3 h-3 rounded-full bg-brand-purple-600"></div>
              )}
            </div>
          </div>
          <div className="mb-8 h-24 flex items-center justify-center bg-slate-50/70 rounded-xl border border-slate-100 transition-transform duration-300">
            {role.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-3">{role.title}</h3>
            <p className="text-base text-slate-500 leading-relaxed">{role.desc}</p>
          </div>
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-sm font-medium">
            <RiTimeLine className="w-5 h-5 text-brand-purple-600" />
            <span>Estimated time: {role.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
