import { describe, it, expect } from 'vitest'
import {
  validateImageFile,
  isWithinCap,
  exceedsMaxPixels,
  ImageProcessingError,
} from '../resize-image'

const makeFile = (type: string, size: number): File => ({ type, size }) as File

describe('validateImageFile', () => {
  it('accepts png / jpeg / webp', () => {
    expect(() => validateImageFile(makeFile('image/png', 1000))).not.toThrow()
    expect(() => validateImageFile(makeFile('image/jpeg', 1000))).not.toThrow()
    expect(() => validateImageFile(makeFile('image/webp', 1000))).not.toThrow()
  })

  it('rejects a non-image type', () => {
    expect(() => validateImageFile(makeFile('application/pdf', 1000))).toThrow(ImageProcessingError)
  })

  it('rejects a file over 10 MB', () => {
    expect(() => validateImageFile(makeFile('image/png', 11 * 1024 * 1024))).toThrow(
      ImageProcessingError,
    )
  })
})

describe('isWithinCap', () => {
  it('is true at or under the cap and false above it', () => {
    expect(isWithinCap('x'.repeat(100), 100)).toBe(true)
    expect(isWithinCap('x'.repeat(101), 100)).toBe(false)
  })
})

describe('exceedsMaxPixels', () => {
  it('flags a decoded image over ~40 MP (decompression bomb) and passes normal ones', () => {
    expect(exceedsMaxPixels(7000, 7000)).toBe(true) // 49 MP
    expect(exceedsMaxPixels(4000, 4000)).toBe(false) // 16 MP
    expect(exceedsMaxPixels(256, 256)).toBe(false)
  })
})
