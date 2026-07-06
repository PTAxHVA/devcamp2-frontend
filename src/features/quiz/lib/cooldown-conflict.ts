/**
 * Helpers for the COOLDOWN_ACTIVE start conflict (NEW-1).
 *
 * The backend answers a too-early retry with 409 details carrying retryAfterMs —
 * the remaining cooldown as a SERVER-clock duration. Re-arming the fail page's
 * countdown from that duration keeps the client timer honest even when the two
 * clocks disagree (the exact skew that caused the retry bounce loop).
 */

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null

/** `retryAfterMs` from the 409 error envelope; undefined on older backends. */
export function readRetryAfterMs(payload: unknown): number | undefined {
  const details = asRecord(asRecord(asRecord(payload)?.error)?.details)
  const value = details?.retryAfterMs
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
}

// Enabling slightly late is fine; enabling early re-creates the bounce. The pad
// absorbs the server->client latency (true remaining time <= retryAfterMs on
// arrival) plus one countdown tick.
export const COOLDOWN_RESYNC_PAD_MS = 1000

/** Client-clock ISO deadline equivalent to the server-clock duration. */
export function cooldownDeadlineFrom(retryAfterMs: number, now: number = Date.now()): string {
  return new Date(now + retryAfterMs + COOLDOWN_RESYNC_PAD_MS).toISOString()
}
