/**
 * Wraps a manual-drag translateX offset into (-setWidth, 0] so a drag on the
 * signature-features marquee feels infinite: the track holds two identical
 * FEATURES sets, so sliding past one set's width can jump back by exactly
 * that width without any visible seam.
 */
export function wrapOffset(value: number, setWidth: number): number {
  if (setWidth <= 0) return value
  const wrapped = value % setWidth
  return wrapped > 0 ? wrapped - setWidth : wrapped
}
