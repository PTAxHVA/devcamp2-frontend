import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { RiMapPinLine, RiLineChartLine, RiLightbulbLine } from 'react-icons/ri'
import { PasswordInput } from '@/components/ui/password-input'
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
    desc: 'Visualize your growth and stay motivated every step of the way.',
  },
  {
    icon: <RiLightbulbLine className="h-5 w-5 text-indigo-600" />,
    title: 'Smart recommendations',
    desc: 'Discover the most relevant topics and resources to boost your skills.',
  },
]

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    setError, // <--- Lấy thêm hàm setError này ra từ useForm để truyền vào hook
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  // Truyền setError vào hook giúp đồng bộ lỗi từ Server đổ trực tiếp vào ô input dưới UI
  const signup = useSignup(setError)

  // Theo dõi giá trị nhập vào ô password để cập nhật UI kiểm tra mật khẩu mạnh/yếu
  const passwordValue = useWatch({ control, name: 'password' }) || ''

  const onSubmit = (data: SignupInput) => {
    // Chỉ truyền đúng 2 trường username và email, password lên backend
    signup.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="border-border-soft flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      {/* ── Left Side: Signup Form ── */}
      <div className="bg-bg-card flex w-full flex-col justify-between px-10 py-16 md:w-1/2">
        <div className="flex-1">
          <h1 className="text-text-primary text-3xl font-extrabold">Create an account</h1>
          <p className="text-text-secondary mt-2 mb-6 text-sm">
            Start your learning journey with VORA today.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* ALERT BANNER: Hiển thị lỗi tổng quan từ server (Ví dụ: lỗi hệ thống, không gán vào ô cụ thể nào) */}
            {signup.isError && !errors.email && !errors.username && !errors.password && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
                Something went wrong during signup. Please verify your information and try again.
              </div>
            )}

            {/* Input Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="username">
                Full name
              </label>
              <input
                id="username"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-error-text text-xs">{errors.username.message}</p>
              )}
            </div>

            {/* Input Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@gmail.com"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('email')}
              />
              {errors.email && <p className="text-error-text text-xs">{errors.email.message}</p>}
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-error-text text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Password Validation Rules UI Block */}
            <div className="bg-bg-section flex flex-col gap-1 rounded-lg p-3 text-xs">
              {passwordRules.map((rule) => {
                const isPassed = rule.test(passwordValue)
                return (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span className={isPassed ? 'font-bold text-green-500' : 'text-text-disabled'}>
                      {isPassed ? '✓' : '○'}
                    </span>
                    <span
                      className={isPassed ? 'font-medium text-green-700' : 'text-text-secondary'}
                    >
                      {rule.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Input Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="confirmPassword">
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-error-text text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Checkbox Terms of Service */}
            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  {...register('terms')}
                />
                <span className="text-text-secondary text-xs leading-normal">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-indigo-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-error-text mt-1 text-xs">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signup.isPending}
              className="mt-2 w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
            >
              {signup.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-text-secondary mt-5 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-text-disabled mt-10 text-xs">
          © {new Date().getFullYear()} VORA. All rights reserved.
        </p>
      </div>

      {/* ── Right Side: Info Panel & Feature Previews ── */}
      <div className="bg-bg-section hidden w-1/2 flex-col gap-8 px-10 py-12 md:flex">
        <div>
          <h2 className="text-text-primary mb-2 text-xl font-bold">
            Personalized. Focused. Effective.
          </h2>
          <p className="text-text-secondary max-w-xs text-sm">
            VORA creates a roadmap just for you and helps you track progress every step of the way.
          </p>
        </div>

        <img
          src={RoadmapSignup}
          alt="Dashboard preview"
          className="border-border-soft w-full rounded-xl border object-cover shadow-sm"
        />

        <div className="flex flex-col gap-4">
          {features.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
                {item.icon}
              </div>
              <div>
                <p className="text-text-primary text-sm font-semibold">{item.title}</p>
                <p className="text-text-secondary text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
