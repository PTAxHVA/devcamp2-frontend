interface TopicProgress {
  sectionTotal: number
  sectionCompleted: number
}

/**
 * A topic is done when it has sections and every one is complete — the same
 * section-progress rule the BE (isTopicCompleted) and the my-learning hook
 * (isTopicDone in use-my-learning.ts) already use.
 */
const isTopicDone = (t: TopicProgress): boolean =>
  t.sectionTotal > 0 && t.sectionCompleted >= t.sectionTotal

/**
 * A roadmap is complete only when it has topics AND every one is done by section
 * progress. Keying off section counts — not a status string — is deliberate: the
 * my-learning hook re-derives its `status` while the roadmap-complete page reads
 * the raw BE `status`, so a status-based check could let one light up the
 * celebration while the other bounces the learner away. Both views feed this
 * predicate the same section counts, so their verdicts always agree. The length
 * guard stops an emptied-out roadmap (all topics removed in the editor) from
 * reading as a false celebration.
 */
export const isRoadmapComplete = (topics: TopicProgress[]): boolean =>
  topics.length > 0 && topics.every(isTopicDone)
