/**
 * Human-readable label for a UserRoadmap `sourceType` enum. Never render the raw
 * enum (e.g. "SUGGESTED") to users — always run it through here.
 */
export function formatRoadmapSource(sourceType: string | null | undefined): string {
  switch (sourceType) {
    case 'SUGGESTED':
      return 'Suggested'
    case 'CUSTOMIZED':
      return 'Customized'
    default:
      if (!sourceType) return ''
      // Title-case any unexpected value so we still never show RAW_CAPS.
      return sourceType.charAt(0).toUpperCase() + sourceType.slice(1).toLowerCase()
  }
}
