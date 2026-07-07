import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCooldownTimer } from '../use-cooldown-timer'

describe('useCooldownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-07T00:00:00.000Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('is expired with no target', () => {
    const { result } = renderHook(() => useCooldownTimer(null))
    expect(result.current.isExpired).toBe(true)
    expect(result.current.secondsLeft).toBe(0)
  })

  it('does NOT report expired while sub-second time remains (NEW-1 early-enable)', () => {
    // 400ms left: floor said 0/expired and the Retry click bounced off the server.
    const target = new Date(Date.now() + 400).toISOString()
    const { result } = renderHook(() => useCooldownTimer(target))
    expect(result.current.secondsLeft).toBe(1)
    expect(result.current.isExpired).toBe(false)
  })

  it('expires once the deadline has actually passed', () => {
    const target = new Date(Date.now() + 1_500).toISOString()
    const { result } = renderHook(() => useCooldownTimer(target))
    expect(result.current.isExpired).toBe(false)

    act(() => {
      vi.advanceTimersByTime(2_000)
    })
    expect(result.current.secondsLeft).toBe(0)
    expect(result.current.isExpired).toBe(true)
  })

  it('re-arms when the target moves later (cooldown resync after a 409)', () => {
    const target = new Date(Date.now() + 1_000).toISOString()
    const { result, rerender } = renderHook(({ t }) => useCooldownTimer(t), {
      initialProps: { t: target },
    })
    act(() => {
      vi.advanceTimersByTime(1_500)
    })
    expect(result.current.isExpired).toBe(true)

    rerender({ t: new Date(Date.now() + 30_000).toISOString() })
    expect(result.current.isExpired).toBe(false)
    expect(result.current.secondsLeft).toBe(30)
    expect(result.current.formatted).toBe('00:30')
  })
})
