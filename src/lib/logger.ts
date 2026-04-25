type LogScope = string

const isProduction = import.meta.env.PROD
const PREFIX = '[VORA]'

const formatScope = (scope: LogScope) => `${PREFIX}[${scope}]`

/**
 * Centralized FE logger. Wrap console so we control verbosity and
 * have one place to forward to Sentry / Logtail later.
 *
 * Usage:
 *   logger.info('auth', 'login submitted', { email })
 *   logger.warn('quiz', 'retry attempt', { attempt: 2 })
 *   logger.error('roadmap', 'fetch failed', err)
 */
export const logger = {
  info(scope: LogScope, message: string, ...args: unknown[]): void {
    if (isProduction) return
    console.info(formatScope(scope), message, ...args)
  },

  warn(scope: LogScope, message: string, ...args: unknown[]): void {
    console.warn(formatScope(scope), message, ...args)
  },

  error(scope: LogScope, message: string, error?: unknown): void {
    console.error(formatScope(scope), message, error)
    // TODO(M3+): forward to Sentry / Logtail when monitoring is wired up.
  },
}
