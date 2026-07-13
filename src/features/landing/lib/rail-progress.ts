/**
 * Living-rail math for the scrollytelling sections (Why VORA / How it works).
 * Pure functions — no DOM — so the fill/checkpoint sync is unit-testable and the
 * <ScrollRoute> component just feeds it measured geometry each animation frame.
 *
 * Ported 1:1 from the approved mockup's measure()/paint():
 *  - the purple fill grows from the FIRST checkpoint toward a reference line
 *    (58% of the viewport height) as the section scrolls up;
 *  - each checkpoint flips to "reached" exactly when the fill front passes its
 *    center (−2px tolerance), never via a separate observer — one source of truth;
 *  - the track/fill are clamped to [firstCenter … lastCenter] so nothing extends
 *    into the empty space below the last checkpoint.
 */

/** Fraction of the viewport height used as the fill's reference line. */
export const RAIL_REF_RATIO = 0.58

/** −px tolerance so a checkpoint lights the instant the fill visually reaches it. */
const REACH_TOLERANCE = 2

export interface RailGeometry {
  /** Offset of the first checkpoint center from the route top (px). */
  first: number
  /** Offset of the last checkpoint center from the route top (px). */
  last: number
  /** Distance the fill can travel: last − first, min 1 to avoid divide-by-zero. */
  span: number
}

export interface RailProgress {
  /** Fill height in px, clamped to [0, span]. */
  fillHeight: number
  /** Per-checkpoint reached flag, in checkpoint order. */
  reached: boolean[]
}

/**
 * Static geometry from measured checkpoint centers (offsets from the route top).
 * Drives the track/fill `top` and the track `height`; recomputed only on
 * resize / late-font reflow, not per scroll frame.
 */
export function railGeometry(centers: readonly number[]): RailGeometry {
  if (centers.length === 0) return { first: 0, last: 0, span: 1 }
  const first = centers[0]
  const last = centers[centers.length - 1]
  return { first, last, span: Math.max(1, last - first) }
}

/**
 * Per-frame progress from the route's current position.
 *
 * @param centers        checkpoint center offsets from the route top (px)
 * @param routeTop       route.getBoundingClientRect().top (px, viewport-relative)
 * @param viewportHeight window.innerHeight (px)
 * @param refRatio       reference line as a fraction of the viewport height
 */
export function railProgress(
  centers: readonly number[],
  routeTop: number,
  viewportHeight: number,
  refRatio: number = RAIL_REF_RATIO,
): RailProgress {
  if (centers.length === 0) return { fillHeight: 0, reached: [] }
  const { first, span } = railGeometry(centers)
  const refY = viewportHeight * refRatio
  const front = clamp(refY - (routeTop + first), 0, span)
  const reached = centers.map((center) => first + front >= center - REACH_TOLERANCE)
  return { fillHeight: front, reached }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
