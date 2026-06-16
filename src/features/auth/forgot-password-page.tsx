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
    <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="w-full md:w-1/2 bg-white px-10 py-16 flex flex-col justify-between">
        <div className="flex-1">
          {forgot.isSuccess ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-extrabold text-gray-900">Check your email</h1>
              <p className="text-sm text-gray-500">
                Nếu email tồn tại, link đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.
              </p>
              <Link
                to="/login"
                className="text-sm text-indigo-600 font-semibold hover:underline mt-4"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot your password?</h1>
              <p className="text-sm text-gray-400 mb-8">
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
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 transition"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="w-full py-2.5 rounded-lg bg-[#001a57] text-white text-sm font-semibold hover:bg-[#002080] transition disabled:opacity-60"
                >
                  {forgot.isPending ? 'Đang gửi...' : 'Send reset link'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Link to="/login" className="text-sm text-indigo-600 font-semibold hover:underline">
                ← Back to login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#f9f9fb] flex-col items-center justify-center px-10 py-12 gap-6">
        <img
          src={ForgotPasswordImg}
          alt="Forgot password"
          className="w-full max-w-sm object-contain"
        />
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">We've got your back</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Reset your password quickly and securely so you can get back to your learning journey.
          </p>
        </div>
      </div>
    </div>
  )
}
