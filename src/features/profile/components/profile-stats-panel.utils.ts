/** Renders a metric value, or "--" for the BE sentinel (-1) / missing data. */
export function formatStatValue(value: number | null | undefined, suffix = ''): string {
  if (value === null || value === undefined || value < 0) return '--'
  return `${value}${suffix}`
}
