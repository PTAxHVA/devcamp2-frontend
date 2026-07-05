import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classNames safely.
 * Example: cn("p-4", isActive && "bg-blue-500", "p-6") → "bg-blue-500 p-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Protocols safe to drop into an <a href> — anything else (notably `javascript:`
// and `data:`) can execute script on our origin when the user clicks the link.
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:']

/**
 * Guard an outbound link URL before it reaches an <a href>.
 *
 * Resource links come from the backend or AI-generated roadmap content, so an
 * attacker-influenced `javascript:...` / `data:...` URI could otherwise run on
 * click (XSS). Allow only http(s)/mailto plus relative/anchor links; return
 * `undefined` for anything else so the anchor renders inert instead of dangerous.
 */
export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  // Relative, root-relative, protocol-relative, and pure-anchor links are same-origin safe.
  if (/^(\/|\.|#)/.test(trimmed)) return trimmed
  try {
    const { protocol } = new URL(trimmed, window.location.origin)
    return SAFE_URL_PROTOCOLS.includes(protocol) ? trimmed : undefined
  } catch {
    // Not parseable as a URL → treat as unsafe rather than pass it through.
    return undefined
  }
}
