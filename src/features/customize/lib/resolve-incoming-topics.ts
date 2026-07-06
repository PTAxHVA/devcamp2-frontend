import type { AvailableTopic } from '@/features/roadmap/hooks/use-available-topics'

export interface IncomingTopic {
  masterTopicId: string
  name: string
  estimatedHours: number
  sectionTotal: number
  /** True when the editor already held this topic's metadata (e.g. switching back before saving). */
  alreadyKnown: boolean
}

interface KnownTopicMeta {
  name: string
  estimatedHours: number
  sectionTotal: number
}

/**
 * Resolve display metadata for topics about to be added to the editor canvas.
 *
 * Prefers metadata the editor already holds: `topicMeta` keeps entries for
 * topics removed from the canvas, which is what lets a path switch be
 * REVERSED before saving — the server's available-topics list reflects the
 * saved enrollment, so right after an unsaved mongo→pg switch it contains
 * neither side's original topic. Falls back to the server list for
 * first-time adds. Returns null if any topic is unknown to both sources
 * (genuinely still loading).
 */
export function resolveIncomingTopics(
  addTopicIds: string[],
  topicMeta: ReadonlyMap<string, KnownTopicMeta>,
  availableTopics: AvailableTopic[] | undefined,
): IncomingTopic[] | null {
  const resolved: IncomingTopic[] = []
  for (const masterTopicId of addTopicIds) {
    const known = topicMeta.get(masterTopicId)
    if (known) {
      resolved.push({
        masterTopicId,
        name: known.name,
        estimatedHours: known.estimatedHours,
        sectionTotal: known.sectionTotal,
        alreadyKnown: true,
      })
      continue
    }
    const fromServer = availableTopics?.find((t) => t.masterTopicId === masterTopicId)
    if (!fromServer) return null
    resolved.push({
      masterTopicId,
      name: fromServer.name,
      estimatedHours: fromServer.estimatedHours,
      sectionTotal: fromServer.sectionTotal,
      alreadyKnown: false,
    })
  }
  return resolved
}
