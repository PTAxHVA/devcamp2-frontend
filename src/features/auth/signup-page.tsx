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
    icon: <RiMapPinLine className="h-5 w-5 text-indigo-600" />,
    title: 'Personalized roadmaps',
    desc: 'Get a learning path tailored to your goals, level, and interests.',
  },
  {
    icon: <RiLineChartLine className="h-5 w-5 text-indigo-600" />,
    title: 'Track your progress',
    desc: 'See your growth and stay motivated with clear progress tracking.',
  },
  {
    icon: <RiLightbulbLine className="h-5 w-5 text-indigo-600" />,
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
    defaultValues: { password: '', terms: false },
  })

  const signup = useSignup(setError)
  const passwordValue = useWatch({ control, name: 'password' }) ?? ''

  const onSubmit = (data: SignupInput) => {
    signup.mutate({ username: data.username, email: data.email, password: data.password })
  }

  return (
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:flex-row">
      <div className="flex w-full flex-col justify-between bg-white px-10 py-12 md:w-1/2">
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Create your account</h1>
          <p className="mb-8 text-sm font-medium text-indigo-500">
            Start your personalized learning journey. It's free to get started.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="username">
                Full name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('username')}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              {passwordValue.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-gray-600">Password must:</p>
                  {passwordRules.map((rule) => {
                    const passed = rule.test(passwordValue)
                    return (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${passed ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'}`}
                        >
                          {passed && (
                            <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 8 8">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-indigo-600"
                  {...register('terms')}
                />
                <span className="text-sm text-gray-500">
                  I agree to VORA's{' '}
                  <Link to="/terms" className="text-indigo-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={signup.isPending}
              className="w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
            >
              {signup.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <p className="mt-10 text-xs text-gray-300">© 2026 VORA. All rights reserved.</p>
      </div>

      <div className="hidden w-1/2 flex-col gap-8 bg-[#f9f9fb] px-10 py-12 md:flex">
        <div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Personalized. Focused. Effective.
          </h2>
          <p className="max-w-xs text-sm text-gray-600">
            VORA creates a roadmap just for you and helps you track progress every step of the way.
          </p>
        </div>
        <img
          src={RoadmapSignup}
          alt="Dashboard preview"
          className="w-full rounded-xl border border-gray-200 object-cover shadow-sm"
        />
        <div className="flex flex-col gap-4">
          {features.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
