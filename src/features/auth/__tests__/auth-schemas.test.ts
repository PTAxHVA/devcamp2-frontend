import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '@/features/auth/auth-schemas'

describe('loginSchema', () => {
  it('validates correct email and password', () => {
    expect(
      loginSchema.safeParse({ email: 'test@example.com', password: 'password123' }).success,
    ).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('email')
  })

  it('rejects password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('password')
  })

  it('rejects empty email', () => {
    expect(loginSchema.safeParse({ email: '', password: 'password123' }).success).toBe(false)
  })
})

describe('signupSchema', () => {
  const valid = {
    username: 'Khanh',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    terms: true,
  }

  it('validates correct signup data', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects when passwords do not match', () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: 'Different123!' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('confirmPassword')
  })

  it('rejects when terms not accepted', () => {
    expect(signupSchema.safeParse({ ...valid, terms: false }).success).toBe(false)
  })

  it('rejects username shorter than 2 characters', () => {
    const result = signupSchema.safeParse({ ...valid, username: 'K' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('username')
  })

  it('rejects username longer than 50 characters', () => {
    expect(signupSchema.safeParse({ ...valid, username: 'a'.repeat(51) }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({ ...valid, email: 'bad-email' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path[0]).toBe('email')
  })

  it('rejects password shorter than 8 characters', () => {
    expect(
      signupSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' }).success,
    ).toBe(false)
  })
})
