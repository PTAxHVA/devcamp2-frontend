import { describe, it, expect } from 'vitest'
import { dedupeResources } from '../lib/dedupe-resources'

describe('dedupeResources (OBS-02)', () => {
  it('collapses resources that share a URL across sections', () => {
    const input = [
      { title: 'VS Code Docs', url: 'https://code.visualstudio.com/docs' },
      { title: 'Node Intro', url: 'https://nodejs.org/en/learn' },
      { title: 'VS Code Docs', url: 'https://code.visualstudio.com/docs' },
    ]
    const out = dedupeResources(input)
    expect(out).toHaveLength(2)
    expect(out.map((r) => r.title)).toEqual(['VS Code Docs', 'Node Intro'])
  })

  it('treats URLs case-insensitively and ignores surrounding whitespace', () => {
    const out = dedupeResources([
      { title: 'A', url: 'https://Example.com/Docs' },
      { title: 'B', url: '  https://example.com/docs  ' },
    ])
    expect(out).toHaveLength(1)
  })

  it('collapses URLs that differ only by a trailing slash', () => {
    const out = dedupeResources([
      { title: 'A', url: 'https://example.com/docs' },
      { title: 'B', url: 'https://example.com/docs/' },
    ])
    expect(out).toHaveLength(1)
  })

  it('falls back to title when URL is missing', () => {
    const out = dedupeResources([
      { title: 'Same', url: '' },
      { title: 'Same', url: null },
      { title: 'Different', url: '' },
    ])
    expect(out.map((r) => r.title)).toEqual(['Same', 'Different'])
  })

  it('preserves first-seen order and returns a new array', () => {
    const input = [
      { title: 'One', url: 'u1' },
      { title: 'Two', url: 'u2' },
      { title: 'One again', url: 'u1' },
    ]
    const out = dedupeResources(input)
    expect(out.map((r) => r.title)).toEqual(['One', 'Two'])
    expect(out).not.toBe(input)
  })
})
