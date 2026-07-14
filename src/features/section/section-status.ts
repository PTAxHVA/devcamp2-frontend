/**
 * Shared 3-state section status, derived purely from progress rows already
 * fetched on the topic-detail page (`useTopicDetail().userProgress`) — no
 * dedicated section-status endpoint exists or is needed.
 *
 * A `UserSectionProgress` row is created the moment a learner SUBMITS a
 * section quiz (pass or fail); it is never created just by opening a quiz.
 * That gives us an unambiguous 3-way split:
 *   - no row for this section          -> 'not_started'
 *   - row exists, isCompleted: false   -> 'in_progress' (submitted, failed)
 *   - row exists, isCompleted: true    -> 'completed'   (passed >= 80%)
 */

export type SectionStatus = 'not_started' | 'in_progress' | 'completed'

/** Minimal shape needed from a `UserSectionProgress` row — kept structural
 * on purpose so callers don't have to import the full BE progress type. */
export interface SectionProgressRow {
  sectionId: string
  isCompleted: boolean
}

export function getSectionStatus(
  userProgress: readonly SectionProgressRow[],
  sectionId: string,
): SectionStatus {
  const progress = userProgress.find((p) => p.sectionId === sectionId)
  if (!progress) return 'not_started'
  return progress.isCompleted ? 'completed' : 'in_progress'
}

export const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Done',
}
