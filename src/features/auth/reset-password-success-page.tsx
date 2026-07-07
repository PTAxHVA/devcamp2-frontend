import { Link } from 'react-router'

export default function ResetPasswordSuccessPage() {
  return (
    <div className="border-border-soft flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      {/* ── Left: illustration ── */}
      <div className="bg-bg-section hidden w-1/2 items-center justify-center px-10 py-12 md:flex">
        <div className="relative flex items-center justify-center">
          {/* Decorative dots */}
          <span className="bg-brand-purple-300 absolute top-0 left-4 h-2 w-2 rounded-full opacity-60" />
          <span className="bg-brand-purple-300 absolute top-6 right-2 h-1.5 w-1.5 rounded-full opacity-40" />
          <span className="bg-brand-purple-300 absolute bottom-4 left-0 h-1.5 w-1.5 rounded-full opacity-40" />
          <span className="bg-brand-purple-300 absolute right-6 bottom-0 h-2 w-2 rounded-full opacity-60" />
          {/* Plus signs */}
          <span className="text-brand-purple-300 absolute -top-4 right-8 text-xl font-light opacity-60">
            +
          </span>
          <span className="text-brand-purple-300 absolute top-8 -left-6 text-xl font-light opacity-60">
            +
          </span>

          {/* Main circle */}
          <div className="border-brand-purple-300 bg-bg-card flex h-36 w-36 items-center justify-center rounded-full border-4 shadow-sm">
            <div className="bg-bg-lavender flex h-24 w-24 items-center justify-center rounded-full">
              <svg className="text-brand-purple-500 h-12 w-12" fill="none" viewBox="0 0 48 48">
                <path
                  d="M10 25l10 10 18-20"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Shadow ellipse */}
          <div className="bg-brand-purple-200 absolute -bottom-4 h-4 w-28 rounded-full opacity-30 blur-sm" />
        </div>
      </div>

      {/* ── Right: message ── */}
      <div className="bg-bg-card flex w-full flex-col justify-center gap-6 px-10 py-16 md:w-1/2">
        <h1 className="text-text-primary text-3xl font-extrabold">Password reset successful!</h1>
        <p className="text-text-muted text-sm">
          Your password has been updated.
          <br />
          You can now log in with your new password.
        </p>
        <Link
          to="/login"
          className="focus-visible:ring-brand-purple-300 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-[#001a57] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#002080] focus-visible:ring-2 focus-visible:outline-none"
        >
          → Back to login
        </Link>
      </div>
    </div>
  )
}
