/**
 * Curated resources are attached per section, so the same external link (e.g. "VS
 * Code Documentation") repeats across a topic's sections. Collapse duplicates, keyed
 * on URL (normalized) and falling back to title when a URL is missing, preserving
 * first-seen order (OBS-02). The "Resources N" count then reflects unique links.
 */
export const dedupeResources = <T extends { url?: string | null; title?: string | null }>(
  resources: T[],
): T[] => {
  const seen = new Set<string>()
  return resources.filter((r) => {
    const url = (r.url ?? '').trim().toLowerCase()
    const key = url || `title:${(r.title ?? '').trim().toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
