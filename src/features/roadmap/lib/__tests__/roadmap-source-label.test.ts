import { describe, it, expect } from 'vitest'
import { formatRoadmapSource } from '@/features/roadmap/lib/roadmap-source-label'

describe('formatRoadmapSource (NEW-7)', () => {
  it('maps the known enums to human labels', () => {
    expect(formatRoadmapSource('SUGGESTED')).toBe('Suggested')
    expect(formatRoadmapSource('CUSTOMIZED')).toBe('Customized')
  })

  it('never renders raw CAPS for an unexpected value', () => {
    expect(formatRoadmapSource('SOMETHING_ELSE')).toBe('Something_else')
  })

  it('returns an empty string for null/undefined/empty', () => {
    expect(formatRoadmapSource(null)).toBe('')
    expect(formatRoadmapSource(undefined)).toBe('')
    expect(formatRoadmapSource('')).toBe('')
  })
})
