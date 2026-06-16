import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { RiMapPinLine, RiLineChartLine, RiLightbulbLine } from 'react-icons/ri'
import RoadmapSignup from '@/assets/roadmap-signup.png'
import { signupSchema, type SignupInput } from '@/features/auth/auth-schemas'
import { useSignup } from '@/features/auth/hooks/use-signup'

const passwordRules = [
  { label: 'Be at least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'Include an uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Include a lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Include a number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Include a special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

const features = [
  {
    icon: <RiMapPinLine className="w-5 h-5 text-indigo-600" />,
    title: 'Personalized roadmaps',
    desc: 'Get a learning path tailored to your goals, level, and interests.',
  },
  {
    icon: <RiLineChartLine className="w-5 h-5 text-indigo-600" />,
    title: 'Track your progress',
    desc: 'See your growth and stay motivated with clear progress tracking.',
  },
  {
    icon: <RiLightbulbLine className="w-5 h-5 text-indigo-600" />,
    title: 'Learn smarter',
    desc: 'Focus on what matters and build real skills with hands-on projects.',
  },
]

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { password: '' },
  })

  const signup = useSignup(setError)
  const passwordValue = useWatch({ control, name: 'password' }) ?? ''

  const onSubmit = (data: SignupInput) => {
    signup.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Left: Form ── */}
      <div className="w-full md:w-1/2 bg-white px-10 py-12 flex flex-col justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Create your account</h1>
          <p className="text-sm text-indigo-500 font-medium mb-8">
            Start your personalized learning journey. It's free to get started.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="username">
                Full name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                {...register('username')}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

              {/* Live password rules */}
              {passwordValue.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-gray-600">Password must:</p>
                  {passwordRules.map((rule) => {
                    const passed = rule.test(passwordValue)
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            passed ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {passed && (
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 8 8">
                              <path
                                d="M1 4l2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-xs transition-colors ${passed ? 'text-indigo-600' : 'text-gray-400'}`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-indigo-600 mt-0.5" />
              <span className="text-sm text-gray-500">
                I agree to VORA's{' '}
                <span className="text-indigo-600 hover:underline cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-indigo-600 hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={signup.isPending}
              className="w-full py-2.5 rounded-lg bg-[#001a57] text-white text-sm font-semibold hover:bg-[#002080] transition disabled:opacity-60"
            >
              {signup.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-300 mt-10">2025 VORA. All rights reserved.</p>
      </div>

      {/* ── Right: Info panel ── */}
      <div className="hidden md:flex w-1/2 bg-[#f9f9fb] flex-col px-10 py-12 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Personalized. Focused. Effective.
          </h2>
          <p className="text-sm text-gray-600 max-w-xs">
            VORA creates a roadmap just for you and helps you track progress every step of the way.
          </p>
        </div>

        <img
          src={RoadmapSignup}
          alt="Dashboard preview"
          className="w-full rounded-xl border border-gray-200 shadow-sm object-cover"
        />

        <div className="flex flex-col gap-4">
          {features.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
