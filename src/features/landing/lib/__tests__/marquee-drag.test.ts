import { describe, expect, it } from 'vitest'
import { wrapOffset } from '../marquee-drag'

describe('wrapOffset', () => {
  it('passes through values already within (-setWidth, 0]', () => {
    expect(wrapOffset(0, 500)).toBe(0)
    expect(wrapOffset(-250, 500)).toBe(-250)
    // -500 % 500 is JS's -0, which is not > 0, so it passes through as-is —
    // renders identically to 0 via translateX, just a signed-zero quirk.
    expect(wrapOffset(-500, 500)).toBe(-0)
  })

  it('wraps a value past the left edge back into range', () => {
    expect(wrapOffset(-600, 500)).toBe(-100)
    expect(wrapOffset(-1200, 500)).toBe(-200)
  })

  it('wraps a positive drag (past the right edge) into the negative range', () => {
    expect(wrapOffset(50, 500)).toBe(-450)
    expect(wrapOffset(600, 500)).toBe(-400)
  })

  it('returns the value unchanged when setWidth is zero or negative (not yet measured)', () => {
    expect(wrapOffset(-42, 0)).toBe(-42)
    expect(wrapOffset(-42, -10)).toBe(-42)
  })
})
