import { describe, it, expect } from 'vitest'
import { safeUrl } from '@/lib/utils'

describe('safeUrl', () => {
  it('passes through http and https links unchanged', () => {
    expect(safeUrl('https://example.com/path')).toBe('https://example.com/path')
    expect(safeUrl('http://example.com')).toBe('http://example.com')
  })

  it('allows mailto and relative/anchor links', () => {
    expect(safeUrl('mailto:hi@example.com')).toBe('mailto:hi@example.com')
    expect(safeUrl('/docs/intro')).toBe('/docs/intro')
    expect(safeUrl('./local')).toBe('./local')
    expect(safeUrl('#section')).toBe('#section')
  })

  it('strips javascript: and data: URIs (XSS vectors)', () => {
    expect(safeUrl('javascript:alert(1)')).toBeUndefined()
    // Protocols are case/whitespace-insensitive to the parser.
    expect(safeUrl('  JavaScript:alert(1)')).toBeUndefined()
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined()
    expect(safeUrl('vbscript:msgbox(1)')).toBeUndefined()
  })

  it('returns undefined for empty/nullish input', () => {
    expect(safeUrl(undefined)).toBeUndefined()
    expect(safeUrl(null)).toBeUndefined()
    expect(safeUrl('')).toBeUndefined()
    expect(safeUrl('   ')).toBeUndefined()
  })
})
