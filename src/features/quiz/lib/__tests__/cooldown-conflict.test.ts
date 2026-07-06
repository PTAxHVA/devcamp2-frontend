import { describe, it, expect } from 'vitest'
import {
  readRetryAfterMs,
  cooldownDeadlineFrom,
  COOLDOWN_RESYNC_PAD_MS,
} from '../cooldown-conflict'

const envelope = (details: unknown) => ({ error: { code: 'COOLDOWN_ACTIVE', details } })

describe('readRetryAfterMs', () => {
  it('reads a valid duration from the 409 envelope', () => {
    expect(readRetryAfterMs(envelope({ attemptId: 'a1', retryAfterMs: 42_000 }))).toBe(42_000)
  })

  it('returns undefined when the backend omits it (older deploy)', () => {
    expect(readRetryAfterMs(envelope({ attemptId: 'a1' }))).toBeUndefined()
  })

  it('rejects non-numeric, negative and non-finite values', () => {
    expect(readRetryAfterMs(envelope({ retryAfterMs: '42000' }))).toBeUndefined()
    expect(readRetryAfterMs(envelope({ retryAfterMs: -1 }))).toBeUndefined()
    expect(readRetryAfterMs(envelope({ retryAfterMs: Number.NaN }))).toBeUndefined()
  })

  it('survives junk payloads', () => {
    expect(readRetryAfterMs(undefined)).toBeUndefined()
    expect(readRetryAfterMs('nope')).toBeUndefined()
    expect(readRetryAfterMs({})).toBeUndefined()
  })
})

describe('cooldownDeadlineFrom', () => {
  it('anchors the server duration to the client clock with the safety pad', () => {
    const now = 1_700_000_000_000
    const deadline = cooldownDeadlineFrom(30_000, now)
    expect(new Date(deadline).getTime()).toBe(now + 30_000 + COOLDOWN_RESYNC_PAD_MS)
  })
})
