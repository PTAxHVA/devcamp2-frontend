import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { RiBookOpenLine, RiLineChartLine } from 'react-icons/ri'
import { PasswordInput } from '@/components/ui/password-input'
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
    <div className="relative isolate w-full max-w-5xl">
      {/* Ambient glow behind the whole login card — opacity-only pulse (no transform),
          so animating a large blur stays compositor-cheap and doesn't reintroduce jank. */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -inset-10 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgba(124,58,237,0.35),transparent)] blur-3xl sm:-inset-16"
      />
      <div className="border-border-soft flex w-full flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
        {/* ── Left: Form ── */}
        <div className="bg-bg-card flex w-full flex-col justify-between px-10 py-12 md:w-1/2">
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
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:border-indigo-400"
                  {...register('email')}
                />
                {errors.email && <p className="text-error-text text-xs">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-primary text-sm font-semibold" htmlFor="password">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:border-indigo-400"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-error-text text-xs">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="focus-visible:ring-brand-purple-300 text-sm text-indigo-600 transition-colors duration-200 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="focus-visible:ring-brand-purple-300 w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#002080] focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
              >
                {login.isPending ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-text-placeholder mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="focus-visible:ring-brand-purple-300 font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-text-disabled mt-10 text-xs">
            © {new Date().getFullYear()} VORA. All rights reserved.
          </p>
        </div>

        {/* ── Right: Info panel ── */}
        <div className="bg-bg-section hidden w-1/2 flex-col items-center justify-center gap-8 px-10 py-12 md:flex">
          <div className="animate-fade-in-up text-center">
            <h2 className="text-text-primary mb-2 text-xl font-bold">
              Your learning roadmap, personalized
            </h2>
            <p className="text-text-secondary mx-auto max-w-xs text-sm">
              VORA helps you build the right skills, in the right order, to reach your goals faster.
            </p>
          </div>

          <div
            className="animate-fade-in-up group relative isolate w-full max-w-sm"
            style={{ animationDelay: '200ms' }}
          >
            {/* Ambient glow — the mock UI below is a flat screenshot, so liveliness comes
              from motion around it rather than inside it. */}
            <div
              aria-hidden
              className="animate-glow-pulse pointer-events-none absolute -inset-8 -z-10 rounded-[28px] bg-[radial-gradient(closest-side,rgba(124,58,237,0.4),transparent)] blur-2xl will-change-[opacity]"
            />
            <div className="animate-bob relative overflow-hidden rounded-xl will-change-transform">
              <img
                src={RoadmapPreview}
                alt="Roadmap preview"
                className="border-border-soft w-full rounded-xl border object-cover shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg"
              />
              <div
                aria-hidden
                className="animate-shimmer-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/50 to-transparent will-change-transform"
              />
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-4">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="animate-fade-in-up flex items-start gap-3"
                style={{ animationDelay: `${260 + i * 90}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 transition-transform duration-200 hover:scale-110">
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
    </div>
  )
}
