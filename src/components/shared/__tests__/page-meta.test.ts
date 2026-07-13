import { describe, it, expect } from 'vitest'
import { getPageMeta } from '../page-meta'

describe('getPageMeta', () => {
  it('maps known routes to a title + icon', () => {
    expect(getPageMeta('/dashboard').title).toBe('Dashboard')
    expect(getPageMeta('/dashboard/add-role').title).toBe('Dashboard')
    expect(getPageMeta('/roadmaps/123/edit').title).toBe('Roadmaps')
    expect(getPageMeta('/my-learning/topics/abc').title).toBe('My Learning')
    expect(getPageMeta('/goals').title).toBe('Career goals')
    expect(getPageMeta('/passport').title).toBe('Passport')
    expect(getPageMeta('/support').title).toBe('Help & Support')
    expect(getPageMeta('/dashboard').Icon).not.toBeNull()
  })

  it('falls back to an empty title for unknown routes', () => {
    const meta = getPageMeta('/something-else')
    expect(meta.title).toBe('')
    expect(meta.Icon).toBeNull()
  })
})
