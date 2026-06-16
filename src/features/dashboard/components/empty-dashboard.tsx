import { Link } from 'react-router'

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-base-100 rounded-xl border-2 border-dashed border-base-300">
      <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🚀</span>
      </div>
      <h2 className="text-2xl font-bold text-base-content mb-3">
        You haven't started any roadmaps yet!
      </h2>
      <p className="text-base-content/60 max-w-md mb-8">
        Start by creating a personalized learning path just for you, or explore the available
        roadmaps in our library.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
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
