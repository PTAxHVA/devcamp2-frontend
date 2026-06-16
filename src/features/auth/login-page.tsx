import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { RiBookOpenLine, RiLineChartLine } from 'react-icons/ri'
import RoadmapPreview from '@/assets/roadmap-login.png'
import { loginSchema, type LoginInput } from '@/features/auth/auth-schemas'
import { useLogin } from '@/features/auth/hooks/use-login'

const features = [
  {
    icon: <RiBookOpenLine className="w-5 h-5 text-indigo-600" />,
    title: 'Focused learning',
    desc: 'We recommend the most relevant topics and resources for you.',
  },
  {
    icon: <RiLineChartLine className="w-5 h-5 text-indigo-600" />,
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
    <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Left: Form ── */}
      <div className="w-full md:w-1/2 bg-white px-10 py-12 flex flex-col justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-8">
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-2.5 rounded-lg bg-[#001a57] text-white text-sm font-semibold hover:bg-[#002080] transition disabled:opacity-60"
            >
              {login.isPending ? 'Logging in...' : 'Login'}
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-300 mt-10">2025 VORA. All rights reserved.</p>
      </div>

      {/* ── Right: Info panel ── */}
      <div className="hidden md:flex w-1/2 bg-[#f9f9fb] flex-col items-center justify-center px-10 py-12 gap-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your learning roadmap, personalized
          </h2>
          <p className="text-sm text-gray-600 max-w-xs">
            VORA helps you build the right skills, in the right order, to reach your goals faster.
          </p>
        </div>

        <img
          src={RoadmapPreview}
          alt="Roadmap preview"
          className="w-full max-w-sm rounded-xl border border-gray-200 shadow-sm object-cover"
        />

        <div className="flex flex-col gap-4 w-full max-w-sm">
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
