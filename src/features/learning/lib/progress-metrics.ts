interface SectionCounts {
  sectionTotal: number
  sectionCompleted: number
}

/**
 * Overall roadmap completion as a SECTION percentage (completed sections / total
 * sections across all topics), rounded. This matches how the dashboard computes
 * roadmap progress. Counting whole completed topics instead made a roadmap read 0%
 * until an entire topic was finished, contradicting the dashboard for the same
 * roadmap (OBS-01).
 */
export const computeOverallSectionProgress = (topics: SectionCounts[]): number => {
  const totals = topics.reduce(
    (acc, t) => {
      acc.total += t.sectionTotal
      acc.completed += t.sectionCompleted
      return acc
    },
    { total: 0, completed: 0 },
  )
  return totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0
}
