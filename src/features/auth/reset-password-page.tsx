import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router'
import { z } from 'zod'
import ResetPasswordImg from '@/assets/reset-password.png'
import { useResetPassword } from './hooks/use-reset-password'

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
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
  const [params] = useSearchParams()
  const token = params.get('token')
  const reset = useResetPassword()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '' },
  })

  const passwordValue = useWatch({ control, name: 'newPassword' }) ?? ''

  const onSubmit = (data: ResetInput) => {
    if (!token) return
    reset.mutate({ token, newPassword: data.newPassword })
  }

  // Token không hợp lệ
  if (!token) {
    return (
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:flex-row">
        <div className="flex w-full flex-col gap-4 bg-white px-10 py-16 md:w-1/2">
          <h1 className="text-3xl font-extrabold text-gray-900">The link is invalid.</h1>
          <p className="text-sm text-gray-500">
            The password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="mt-2 text-sm font-semibold text-indigo-600 hover:underline"
          >
            → Request a new link
          </Link>
        </div>
        <div className="hidden w-1/2 items-center justify-center bg-[#f9f9fb] px-10 py-12 md:flex">
          <img
            src={ResetPasswordImg}
            alt="Reset password"
            className="w-full max-w-sm object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:flex-row">
      <div className="flex w-full flex-col justify-between bg-white px-10 py-12 md:w-1/2">
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Reset your password</h1>
          <p className="mb-8 text-sm font-medium text-indigo-500">
            Create a new password for your account.
            <br />
            Make sure it's strong and unique.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="newPassword">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}

              <div className="mt-2 flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-gray-600">Password must:</p>
                {passwordRules.map((rule) => {
                  const passed = rule.test(passwordValue)
                  return (
                    <div key={rule.label} className="flex items-center gap-2">
                      <div
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          passed ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'
                        }`}
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-800" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition outline-none focus:border-indigo-400"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={reset.isPending}
              className="w-full rounded-lg bg-[#001a57] py-2.5 text-sm font-semibold text-white transition hover:bg-[#002080] disabled:opacity-60"
            >
              {reset.isPending ? 'Processing...' : 'Reset password'}
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
        </div>
      </div>

      <div className="hidden w-1/2 items-center justify-center bg-[#f9f9fb] px-10 py-12 md:flex">
        <img
          src={ResetPasswordImg}
          alt="Reset password"
          className="w-full max-w-xs object-contain"
        />
      </div>
    </div>
  )
}
