import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { z } from 'zod'
import ForgotPasswordImg from '@/assets/forgot-password.png'
import { useForgotPassword } from './hooks/use-forgot-password'

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
})
type ForgotInput = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = (data: ForgotInput) => {
    forgot.mutate(data.email)
  }

  return (
    <div className="border-border-soft flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      <div className="bg-bg-card flex w-full flex-col justify-between px-10 py-16 md:w-1/2">
        <div className="flex-1">
          {forgot.isSuccess ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-text-primary text-3xl font-extrabold">Check your email</h1>
              <p className="text-text-muted text-sm">
                If the email exists, a password reset link has been sent. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="focus-visible:ring-brand-purple-300 mt-4 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-text-primary mb-2 text-3xl font-extrabold">
                Forgot your password?
              </h1>
              <p className="text-text-placeholder mb-8 text-sm">
                Enter your email and we'll send reset instructions.
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
                    placeholder="you@gmail.com"
                    className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:border-indigo-400"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-error-text text-xs">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="focus-visible:ring-brand-purple-300 w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#002080] focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
                >
                  {forgot.isPending ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="bg-border-soft h-px flex-1" />
                <span className="text-text-placeholder text-xs">or</span>
                <div className="bg-border-soft h-px flex-1" />
              </div>

              <Link
                to="/login"
                className="focus-visible:ring-brand-purple-300 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                ← Back to login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-bg-section hidden w-1/2 flex-col items-center justify-center gap-6 px-10 py-12 md:flex">
        <img
          src={ForgotPasswordImg}
          alt="Forgot password"
          className="w-full max-w-sm object-contain"
        />
        <div className="text-center">
          <h2 className="text-text-primary mb-1 text-lg font-bold">We've got your back</h2>
          <p className="text-text-muted max-w-xs text-sm">
            Reset your password quickly and securely so you can get back to your learning journey.
          </p>
        </div>
      </div>
    </div>
  )
}
