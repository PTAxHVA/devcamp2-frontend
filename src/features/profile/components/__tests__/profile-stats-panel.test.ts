import { describe, it, expect } from 'vitest'
import { formatStatValue } from '../profile-stats-panel.utils'

describe('formatStatValue', () => {
  it('renders the value with an optional suffix', () => {
    expect(formatStatValue(5)).toBe('5')
    expect(formatStatValue(88, '%')).toBe('88%')
    expect(formatStatValue(0)).toBe('0')
  })

  it('renders "--" for the BE sentinel (-1) and missing data', () => {
    expect(formatStatValue(-1)).toBe('--')
    expect(formatStatValue(-1, '%')).toBe('--')
    expect(formatStatValue(null)).toBe('--')
    expect(formatStatValue(undefined)).toBe('--')
  })
})
