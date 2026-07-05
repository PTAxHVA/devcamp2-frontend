import type { GapTopicItem } from '../types'

/**
 * The missing gap topics the target roadmap can actually accept right now =
 * intersection with GET /roadmaps/:id/available-topics (topics offered by the
 * roadmap's branches and not already enrolled). Keeps the gap-list order,
 * dedupes ids, and is exactly the payload for PATCH /roadmaps/:id addTopicIds.
 */
export function pickAddableTopicIds(
  missing: GapTopicItem[],
  availableTopicIds: string[],
): string[] {
  const available = new Set(availableTopicIds)
  const picked = new Set<string>()
  const result: string[] = []
  for (const topic of missing) {
    if (!available.has(topic.topicId) || picked.has(topic.topicId)) continue
    picked.add(topic.topicId)
    result.push(topic.topicId)
  }
  return result
}
