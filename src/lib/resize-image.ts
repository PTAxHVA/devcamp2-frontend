// Client-side avatar processing: validate → center-crop to a square → downscale →
// encode as a compact JPEG data-URL under a size cap. Keeps the payload small so
// it fits the BE avatar cap (~280k chars) and the 512 KB request-body limit.

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_INPUT_BYTES = 10 * 1024 * 1024 // reject absurd inputs before decoding
const DEFAULT_SIZE = 256
const DEFAULT_MAX_CHARS = 200_000 // comfortably under the BE 280k cap
const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4]

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImageProcessingError'
  }
}

/** Throws a friendly ImageProcessingError when the file isn't an accepted image
 *  type or is absurdly large. Pure enough to unit-test with a stub File. */
export function validateImageFile(file: File): void {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImageProcessingError('Please choose a PNG, JPG, or WebP image.')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageProcessingError('That image is too large — please choose one under 10 MB.')
  }
}

/** True when a data-URL is within the persisted-size cap (pure). */
export const isWithinCap = (dataUrl: string, maxChars = DEFAULT_MAX_CHARS): boolean =>
  dataUrl.length <= maxChars

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new ImageProcessingError('Could not read that image.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new ImageProcessingError('Could not read that image.'))
    img.src = src
  })
}

/**
 * Center-crop `file` to a square, downscale to `size`px, and encode as a JPEG
 * data-URL under `maxChars` (dropping quality until it fits). Throws
 * ImageProcessingError on unusable input or if it can't be compressed enough.
 */
export async function cropSquareToDataUrl(
  file: File,
  size = DEFAULT_SIZE,
  maxChars = DEFAULT_MAX_CHARS,
): Promise<string> {
  validateImageFile(file)

  const source = await readAsDataUrl(file)
  const img = await loadImage(source)

  const side = Math.min(img.width, img.height)
  if (!side) throw new ImageProcessingError('Could not read that image.')
  const sx = (img.width - side) / 2
  const sy = (img.height - side) / 2

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ImageProcessingError('Your browser could not process the image.')
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size)

  for (const quality of QUALITY_STEPS) {
    const out = canvas.toDataURL('image/jpeg', quality)
    if (isWithinCap(out, maxChars)) return out
  }
  throw new ImageProcessingError(
    'Could not compress that image enough — please try a simpler picture.',
  )
}
