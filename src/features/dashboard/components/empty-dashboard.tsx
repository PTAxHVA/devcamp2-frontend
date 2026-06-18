import { Link } from 'react-router'

export function EmptyDashboard() {
  return (
    <div className="bg-base-100 border-base-300 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-20 text-center">
      <div className="bg-base-200 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <span className="text-4xl">🚀</span>
      </div>
      <h2 className="text-base-content mb-3 text-2xl font-bold">
        You haven't started any roadmaps yet!
      </h2>
      <p className="text-base-content/60 mb-8 max-w-md">
        Start by creating a personalized learning path just for you, or explore the available
        roadmaps in our library.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link to="/onboarding" className="btn btn-primary">
          Create my roadmap
        </Link>
        <Link to="/roadmaps/browse" className="btn btn-outline">
          Explore roadmaps
        </Link>
      </div>
    </div>
  )
}
