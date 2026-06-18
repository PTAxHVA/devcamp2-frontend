/**
 * Auth helpers. Source of truth for "is the user logged in" = presence of the
 * JWT in localStorage (the same token api-client auto-attaches). localStorage
 * persists across sessions, so a returning user is remembered automatically.
 * When the real login flow (F1) lands and stores this token, these helpers keep
 * working unchanged.
 */
const TOKEN_KEY = 'token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const isAuthenticated = (): boolean => Boolean(getToken())
