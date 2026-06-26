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
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:flex-row">
      <div className="flex w-full flex-col justify-between bg-white px-10 py-12 md:w-1/2">
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="mb-8 text-sm text-slate-400">
            Log in to continue your personalized learning journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
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

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-10 text-xs text-gray-300">© 2026 VORA. All rights reserved.</p>
      </div>

      <div className="hidden w-1/2 flex-col items-center justify-center gap-8 bg-[#f9f9fb] px-10 py-12 md:flex">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Your learning roadmap, personalized
          </h2>
          <p className="max-w-xs text-sm text-gray-600">
            VORA helps you build the right skills, in the right order, to reach your goals faster.
          </p>
        </div>
        <img
          src={RoadmapPreview}
          alt="Roadmap preview"
          className="w-full max-w-sm rounded-xl border border-gray-200 object-cover shadow-sm"
        />
        <div className="flex w-full max-w-sm flex-col gap-4">
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
