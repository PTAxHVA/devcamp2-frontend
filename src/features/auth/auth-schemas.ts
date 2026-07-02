import { z } from 'zod'

// Strong password enforced on signup + reset — mirrors the 5-rule checklist shown
// in the UI so it can't imply rules we don't enforce (M6). Login stays min(8) so
// existing accounts with weaker passwords are never locked out.
export const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[0-9]/, 'Include a number')
  .regex(/[^A-Za-z0-9]/, 'Include a special character')

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Name must be 2-50 characters')
      .max(50, 'Name must be 2-50 characters'),
    email: z.string().email('Invalid email address'),
    password: strongPassword,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy to create an account',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>
