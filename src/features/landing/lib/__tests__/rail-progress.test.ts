import { describe, expect, it } from 'vitest'
import { railGeometry, railProgress, RAIL_REF_RATIO } from '../rail-progress'

// Four checkpoints, evenly spaced 200px apart from the route top.
const CENTERS = [40, 240, 440, 640]
const VH = 1000
const REF_Y = VH * RAIL_REF_RATIO // 580

describe('railGeometry', () => {
  it('clamps track to [first … last] checkpoint centers', () => {
    expect(railGeometry(CENTERS)).toEqual({ first: 40, last: 640, span: 600 })
  })

  it('never returns a zero span (single checkpoint)', () => {
    expect(railGeometry([120])).toEqual({ first: 120, last: 120, span: 1 })
  })

  it('returns a safe default for no checkpoints', () => {
    expect(railGeometry([])).toEqual({ first: 0, last: 0, span: 1 })
  })
})

describe('railProgress — fill height', () => {
  it('is empty when there are no checkpoints', () => {
    expect(railProgress([], 0, VH)).toEqual({ fillHeight: 0, reached: [] })
  })

  it('keeps the fill at 0 below the fold, first checkpoint lit (fill originates there)', () => {
    // routeTop far below the fold → refY − (top + first) < 0 → front clamps to 0.
    // By design (matches the mockup): the fill starts AT the first checkpoint, so
    // cp#1 reads reached as soon as the section is measured, even with 0 fill.
    const { fillHeight, reached } = railProgress(CENTERS, VH, VH)
    expect(fillHeight).toBe(0)
    expect(reached).toEqual([true, false, false, false])
  })

  it('grows with front = refY − (routeTop + first), clamped to span', () => {
    // routeTop = 0 → front = 580 − 40 = 540 (< span 600)
    expect(railProgress(CENTERS, 0, VH).fillHeight).toBe(540)
  })

  it('never exceeds the span when the route is scrolled well past', () => {
    // routeTop = −500 → raw front = 580 − (−500 + 40) = 1040 → clamped to 600
    expect(railProgress(CENTERS, -500, VH).fillHeight).toBe(600)
  })
})

describe('railProgress — reached vector', () => {
  it('lights checkpoints sequentially as the fill front passes each center', () => {
    // routeTop = 0 → front 540, fill front absolute = first(40)+540 = 580.
    // reached[i] = 580 >= center[i] − 2  → [40,240,440] reached, 640 not.
    expect(railProgress(CENTERS, 0, VH).reached).toEqual([true, true, true, false])
  })

  it('lights the first checkpoint the moment the section is in view', () => {
    // front 0 → absolute 40 >= 40 − 2 → first reached, rest not.
    expect(railProgress(CENTERS, REF_Y - CENTERS[0], VH).reached).toEqual([
      true,
      false,
      false,
      false,
    ])
  })

  it('lights the last checkpoint only when the fill reaches the bottom', () => {
    expect(railProgress(CENTERS, -500, VH).reached).toEqual([true, true, true, true])
  })

  it('does not light a checkpoint whose center the front has not passed', () => {
    // Put the front just below the 3rd center (440): choose routeTop so
    // absolute front = 439 → third (440−2=438) reached, but only just.
    // absolute front = first + clamp(refY − (top+first)) = 40 + front.
    // want 40+front = 430 → front = 390 → refY − (top+40) = 390 → top = 150.
    const { reached } = railProgress(CENTERS, 150, VH)
    // absolute 430: >=38? yes; >=238? yes; >=438? no; >=638? no
    expect(reached).toEqual([true, true, false, false])
  })
})
