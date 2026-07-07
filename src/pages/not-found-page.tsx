import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="bg-bg-soft flex min-h-screen flex-col items-center justify-center gap-6">
      <p className="text-brand-purple-300 text-8xl font-extrabold">404</p>
      <div className="text-center">
        <h1 className="text-text-primary mb-2 text-2xl font-extrabold">Page not found</h1>
        <p className="text-text-muted text-sm">
          The page you are looking for does not exist or has been removed.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/"
          className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
