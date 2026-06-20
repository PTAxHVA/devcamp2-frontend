import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { RiBookOpenLine, RiLineChartLine } from 'react-icons/ri'
import RoadmapPreview from '@/assets/roadmap-login.png'
import { loginSchema, type LoginInput } from '@/features/auth/auth-schemas'
import { useLogin } from '@/features/auth/hooks/use-login'

const features = [
  {
    icon: <RiBookOpenLine className="h-5 w-5 text-indigo-600" />,
    title: 'Focused learning',
    desc: 'We recommend the most relevant topics and resources for you.',
  },
  {
    icon: <RiLineChartLine className="h-5 w-5 text-indigo-600" />,
    title: 'Track your progress',
    desc: 'Visualize your growth and stay motivated every step of the way.',
  },
]

export default function LoginPage() {
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginInput) => {
    login.mutate(data)
  }

  return (
    <div className="border-border-soft flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      {/* ── Left: Form ── */}
      <div className="flex w-full flex-col justify-between bg-white px-10 py-12 md:w-1/2">
        <div className="flex-1">
          <h1 className="text-text-primary mb-2 text-4xl font-extrabold">Welcome back</h1>
          <p className="text-text-placeholder mb-8 text-sm">
            Log in to continue your personalized learning journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('email')}
              />
              {errors.email && <p className="text-error-text text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-error-text text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-text-secondary flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-indigo-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
            >
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-text-placeholder text-xs">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button className="border-border-soft text-text-secondary hover:bg-bg-section flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-text-placeholder mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-text-disabled mt-10 text-xs">2025 VORA. All rights reserved.</p>
      </div>

      {/* ── Right: Info panel ── */}
      <div className="hidden w-1/2 flex-col items-center justify-center gap-8 bg-[#f9f9fb] px-10 py-12 md:flex">
        <div className="text-center">
          <h2 className="text-text-primary mb-2 text-xl font-bold">
            Your learning roadmap, personalized
          </h2>
          <p className="text-text-secondary max-w-xs text-sm">
            VORA helps you build the right skills, in the right order, to reach your goals faster.
          </p>
        </div>

        <img
          src={RoadmapPreview}
          alt="Roadmap preview"
          className="border-border-soft w-full max-w-sm rounded-xl border object-cover shadow-sm"
        />

        <div className="flex w-full max-w-sm flex-col gap-4">
          {features.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
                {item.icon}
              </div>
              <div>
                <p className="text-text-primary text-sm font-bold">{item.title}</p>
                <p className="text-text-muted mt-0.5 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
