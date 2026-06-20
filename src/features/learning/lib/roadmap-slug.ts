/**
 * URL slug for a roadmap, derived from its role name. Produces the short, readable
 * forms the app routes on (e.g. /my-learning/front-end, /my-learning/back-end) and
 * falls back to a generic slugify so any future role still gets a usable URL.
 * Round-trips with itself: the page matches a slug back by comparing roadmapSlug(roleName).
 */
export function roadmapSlug(roleName: string | null | undefined): string {
  const name = (roleName ?? '').toLowerCase()
  if (name.includes('front')) return 'front-end'
  if (name.includes('back')) return 'back-end'
  if (name.includes('full')) return 'full-stack'

  const generic = name
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return generic || 'roadmap'
}
