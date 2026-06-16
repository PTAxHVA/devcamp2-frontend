import { Link } from 'react-router'

export default function ResetPasswordSuccessPage() {
  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Left: message ── */}
      <div className="w-full md:w-1/2 bg-white px-10 py-16 flex flex-col justify-center gap-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Password reset successful!</h1>
        <p className="text-sm text-gray-500">
          Your password has been updated.
          <br />
          You can now log in with your new password.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-[#001a57] text-white text-sm font-semibold hover:bg-[#002080] transition w-fit"
        >
          → Back to login
        </Link>
      </div>

      {/* ── Right: illustration ── */}
      <div className="hidden md:flex w-1/2 bg-[#f9f9fb] flex-col items-center justify-center px-10 py-12 gap-6">
        {/* Check circle illustration */}
        <div className="relative flex items-center justify-center">
          {/* Decorative dots */}
          <span className="absolute top-0 left-4 w-2 h-2 rounded-full bg-brand-purple-300 opacity-60" />
          <span className="absolute top-6 right-2 w-1.5 h-1.5 rounded-full bg-brand-purple-300 opacity-40" />
          <span className="absolute bottom-4 left-0 w-1.5 h-1.5 rounded-full bg-brand-purple-300 opacity-40" />
          <span className="absolute bottom-0 right-6 w-2 h-2 rounded-full bg-brand-purple-300 opacity-60" />
          {/* Plus signs */}
          <span className="absolute -top-4 right-8 text-brand-purple-300 text-xl font-light opacity-60">
            +
          </span>
          <span className="absolute top-8 -left-6 text-brand-purple-300 text-xl font-light opacity-60">
            +
          </span>

          {/* Main circle */}
          <div className="w-36 h-36 rounded-full border-4 border-brand-purple-300 bg-white flex items-center justify-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-bg-lavender flex items-center justify-center">
              <svg className="w-12 h-12 text-brand-purple-500" fill="none" viewBox="0 0 48 48">
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
          <div className="absolute -bottom-4 w-28 h-4 rounded-full bg-brand-purple-200 opacity-30 blur-sm" />
        </div>

        <div className="text-center mt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Password reset successful!</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Your password has been updated. You can now log in with your new password.
          </p>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-[#001a57] text-white text-sm font-semibold hover:bg-[#002080] transition"
        >
          → Back to login
        </Link>
      </div>
    </div>
  )
}
