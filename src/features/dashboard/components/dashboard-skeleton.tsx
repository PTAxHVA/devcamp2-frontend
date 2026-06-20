export function DashboardSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="mb-8 h-10 w-1/3 rounded-xl bg-slate-200"></div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl border border-slate-200 bg-slate-100"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100 lg:col-span-2"></div>
        <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100"></div>
      </div>
    </div>
  )
}
