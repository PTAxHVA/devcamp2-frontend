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
          className="rounded-xl bg-[#003B71] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082A5E]"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/"
          className="border-border-input text-text-primary hover:bg-bg-section rounded-xl border px-5 py-2.5 text-sm font-semibold transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
