import { FiPlusCircle, FiCheckCircle, FiCompass } from 'react-icons/fi'

export function AddAnotherRolePage() {
  // Mock Data
  const availableRolesForAdd = [
    { masterRoadmapId: '1', roleName: 'Backend Developer', isEnrolled: false },
    { masterRoadmapId: '2', roleName: 'DevOps Engineer', isEnrolled: false },
    { masterRoadmapId: '3', roleName: 'Frontend Developer', isEnrolled: true },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-4xl p-6 duration-500">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
          <FiCompass className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Add a new goal</h1>
        <p className="mt-2 font-medium text-slate-500">
          Choose a new role to learn alongside your current roadmap.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {availableRolesForAdd.map((role) => (
          <div
            key={role.masterRoadmapId}
            className={`rounded-2xl border p-6 transition-all duration-300 ${role.isEnrolled ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-indigo-100 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{role.roleName}</h3>
              {role.isEnrolled && (
                <span className="badge badge-ghost font-bold text-slate-500">
                  <FiCheckCircle className="mr-1" /> Enrolled
                </span>
              )}
            </div>
            <button
              disabled={role.isEnrolled}
              className={`btn w-full rounded-xl font-bold transition-all ${role.isEnrolled ? 'btn-disabled border-none bg-slate-200 text-slate-400' : 'bg-slate-900 text-white shadow-md hover:-translate-y-0.5 hover:bg-slate-800'}`}
            >
              {role.isEnrolled ? (
                'Already enrolled'
              ) : (
                <>
                  <FiPlusCircle className="mr-1 h-5 w-5" /> Add this roadmap
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
