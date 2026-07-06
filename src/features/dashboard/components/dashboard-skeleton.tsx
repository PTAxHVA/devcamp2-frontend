export function DashboardSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="bg-border-soft mb-8 h-10 w-1/3 rounded-xl"></div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-border-soft bg-bg-section h-32 rounded-3xl border"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="border-border-soft bg-bg-section h-64 rounded-3xl border lg:col-span-2"></div>
        <div className="border-border-soft bg-bg-section h-64 rounded-3xl border"></div>
      </div>
    </div>
  )
}
