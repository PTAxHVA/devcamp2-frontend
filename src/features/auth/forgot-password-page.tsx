import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { z } from 'zod'
import ForgotPasswordImg from '@/assets/forgot-password.png'
import { useForgotPassword } from './hooks/use-forgot-password'

const forgotSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
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
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:flex-row">
      <div className="flex w-full flex-col justify-between bg-white px-10 py-16 md:w-1/2">
        <div className="flex-1">
          {forgot.isSuccess ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-extrabold text-gray-900">Check your email</h1>
              <p className="text-sm text-gray-500">
                If the email exists, a password reset link has been sent. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Forgot your password?</h1>
              <p className="mb-8 text-sm text-gray-400">
                Enter your email and we'll send reset instructions.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
                >
                  {forgot.isPending ? 'Đang gửi...' : 'Send reset link'}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:underline">
                ← Back to login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hidden w-1/2 flex-col items-center justify-center gap-6 bg-[#f9f9fb] px-10 py-12 md:flex">
        <img
          src={ForgotPasswordImg}
          alt="Forgot password"
          className="w-full max-w-sm object-contain"
        />
        <div className="text-center">
          <h2 className="mb-1 text-lg font-bold text-gray-900">We've got your back</h2>
          <p className="max-w-xs text-sm text-gray-500">
            Reset your password quickly and securely so you can get back to your learning journey.
          </p>
        </div>
      </div>
    </div>
  )
}
