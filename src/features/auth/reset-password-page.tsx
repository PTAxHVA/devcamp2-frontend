import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import ResetPasswordImg from '@/assets/reset-password.png'
import { useResetPassword } from './hooks/use-reset-password'

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type ResetInput = z.infer<typeof resetSchema>

const passwordRules = [
  { label: 'Be at least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'Include an uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Include a lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Include a number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Include a special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

export default function ResetPasswordPage() {
  // 1. Lấy token tự động từ URL (Hỗ trợ cả route cũ /auth/reset-password và route mới /reset-password)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  // 2. Gọi Hook Mutation xử lý API
  const reset = useResetPassword()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Theo dõi giá trị nhập vào ô password để hiển thị tích xanh các rule kiểm tra mật khẩu
  const newPasswordValue = useWatch({ control, name: 'newPassword' }) || ''

  const onSubmit = (data: ResetInput) => {
    // FIX LOW: Guard bảo mật chặn đứng hành vi submit ép khi token rỗng
    if (!token) {
      toast.error('Invalid or expired reset token. Please request a new link.')
      return
    }

    reset.mutate({
      token,
      newPassword: data.newPassword,
    })
  }

  return (
    <div className="border-border-soft flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-sm md:flex-row">
      {/* ── Left Side: Reset Password Form ── */}
      <div className="flex w-full flex-col justify-between bg-white px-10 py-16 md:w-1/2">
        <div className="flex-1">
          <h1 className="text-text-primary text-3xl font-extrabold">Reset password</h1>
          <p className="text-text-secondary mt-2 mb-6 text-sm">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Input New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-primary text-sm font-semibold" htmlFor="newPassword">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-error-text text-xs">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Password Validation Rules UI Block */}
            <div className="flex flex-col gap-1 rounded-lg bg-gray-50 p-3 text-xs">
              {passwordRules.map((rule) => {
                const isPassed = rule.test(newPasswordValue)
                return (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span className={isPassed ? 'font-bold text-green-500' : 'text-gray-300'}>
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
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="border-border-soft w-full rounded-lg border px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-error-text text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={reset.isPending || !token}
              className="w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
            >
              {reset.isPending ? 'Processing...' : 'Reset password'}
            </button>

            {/* FIX LOW: Thêm block cảnh báo kèm lối thoát mở dẫn sang trang /forgot-password */}
            {!token && (
              <div className="mt-2 flex flex-col items-center gap-2 rounded-lg bg-red-50 p-3 text-center">
                <p className="text-xs font-semibold text-red-500">
                  Error: Reset token is missing or has expired.
                </p>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Request a new reset link →
                </Link>
              </div>
            )}
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-text-placeholder text-xs">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:underline">
            ← Back to login
          </Link>
        </div>
      </div>

      {/* ── Right Side: Info Panel & Illustration ── */}
      <div className="hidden w-1/2 flex-col items-center justify-center gap-6 bg-[#f9f9fb] px-10 py-12 md:flex">
        <img
          src={ResetPasswordImg}
          alt="Reset password"
          className="w-full max-w-sm object-contain"
        />
        <div className="text-center">
          <h2 className="text-text-primary mb-1 text-lg font-bold">Secure your account</h2>
          <p className="text-text-secondary max-w-xs text-sm">
            Make sure your new password is strong and contains a mix of letters, numbers, and
            special characters.
          </p>
        </div>
      </div>
    </div>
  )
}
