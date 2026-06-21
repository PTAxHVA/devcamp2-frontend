import { RiTimeLine } from 'react-icons/ri'
import { roles } from '../../data/onboarding-data'

interface StepRoleProps {
  selectedRole?: string
  setSelectedRole: (id: string) => void
}

export const StepRole = ({ selectedRole, setSelectedRole }: StepRoleProps) => {
  return (
    <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <div
          key={role.id}
          onClick={() => setSelectedRole(role.id)}
          className={`relative flex min-h-80 cursor-pointer flex-col rounded-2xl bg-white p-10 transition-all duration-300 ${
            selectedRole === role.id
              ? 'border-brand-purple-300 ring-brand-purple-300 -translate-y-1 border-2 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2'
              : 'border-border-soft hover:border-border-input border shadow-sm hover:-translate-y-1 hover:shadow-xl'
          } `}
        >
          <div className="absolute top-4 right-4 flex items-center justify-center">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${selectedRole === role.id ? 'border-brand-purple-600' : 'border-border-input'} `}
            >
              {selectedRole === role.id && (
                <div className="bg-brand-purple-600 h-3 w-3 rounded-full"></div>
              )}
            </div>
          </div>
          <div className="border-border-soft bg-bg-section/70 mb-8 flex h-24 items-center justify-center rounded-xl border transition-transform duration-300">
            {role.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary mb-3 text-xl font-bold">{role.title}</h3>
            <p className="text-text-muted text-base leading-relaxed">{role.desc}</p>
          </div>
          <div className="border-border-soft text-text-muted mt-8 flex items-center gap-2 border-t pt-5 text-sm font-medium">
            <RiTimeLine className="text-brand-purple-600 h-5 w-5" />
            <span>Estimated time: {role.time}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
