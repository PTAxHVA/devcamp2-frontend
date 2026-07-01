export function alignCurrentWeekActivityToLastSevenDays(
  activityDays: boolean[],
  today = new Date(),
): boolean[] {
  if (activityDays.length !== 7) return Array(7).fill(false)

  const currentWeekdayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  return Array.from({ length: 7 }, (_, index) => {
    const weekdayIndex = currentWeekdayIndex - (6 - index)
    return weekdayIndex >= 0 && Boolean(activityDays[weekdayIndex])
  })
}
