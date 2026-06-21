import type { BrowseRoadmap } from '@/features/roadmap/hooks/use-browse-roadmaps'

/**
 * Wizard answers are an untyped bag (zustand store keyed by question id). These
 * helpers translate them into the canonical `POST /onboarding/questionnaire`
 * body the backend expects (see onboarding.schema.ts on the API).
 */
type Answers = Record<string, unknown>

/** Payload accepted by POST /onboarding/questionnaire. */
export interface QuestionnairePayload {
  rolePreference: string
  goal: string
  currentComfortLevel?: string
  timePerWeekHours?: number
  learningStyle?: string
  frameworkPreference?: string
  projectType?: string
  cliComfort?: string
  timelineGoal?: string
  operatingSystem?: string
  selectedBranchIds?: string[]
  extraPreferences?: string
}

/** Coerce an answer to a non-empty trimmed string, or undefined. */
const str = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

// The weekly-time question stores a range ('5-10'); the API wants an integer
// number of hours. Map each bucket to a representative value.
const WEEKLY_TIME_HOURS: Record<string, number> = {
  '0-5': 5,
  '5-10': 10,
  '10-20': 15,
  '20+': 25,
}

/**
 * Build the questionnaire body from wizard answers plus the branch ids the user
 * is enrolling into. Optional fields are omitted when unanswered so the upsert
 * doesn't overwrite anything with empty strings.
 */
export function mapAnswersToQuestionnaire(
  answers: Answers,
  selectedBranchIds: string[],
): QuestionnairePayload {
  const weeklyTime = str(answers.weeklyTime)

  // Customize-path extras (styling, project direction) have no dedicated API
  // field — fold them into extraPreferences so the AI still sees them.
  const extras = [
    str(answers.additionalInfo),
    str(answers.styling) && `Preferred styling: ${str(answers.styling)}`,
    str(answers.projectDirection) && `Project direction: ${str(answers.projectDirection)}`,
  ]
    .filter(Boolean)
    .join('. ')

  const payload: QuestionnairePayload = {
    rolePreference: str(answers.role) ?? '',
    goal: str(answers.goal) ?? '',
    currentComfortLevel: str(answers.level),
    timePerWeekHours: weeklyTime ? WEEKLY_TIME_HOURS[weeklyTime] : undefined,
    learningStyle: str(answers.learningStyle),
    // The learning-path step (learningFramework) is the more specific choice;
    // fall back to the preferences-step framework question.
    frameworkPreference: str(answers.learningFramework) ?? str(answers.framework),
    projectType: str(answers.projectType),
    cliComfort: str(answers.cliComfort),
    timelineGoal: str(answers.targetTimeline),
    operatingSystem: str(answers.os),
    selectedBranchIds: selectedBranchIds.length > 0 ? selectedBranchIds : undefined,
    extraPreferences: extras.length > 0 ? extras.slice(0, 1000) : undefined,
  }

  // Strip undefined keys so we send a clean body.
  ;(Object.keys(payload) as (keyof QuestionnairePayload)[]).forEach((key) => {
    if (payload[key] === undefined) delete payload[key]
  })

  return payload
}

/**
 * Pick the master roadmap for the chosen onboarding role. Matches by role
 * keyword (frontend/backend/fullstack); when there's no match (e.g. fullstack
 * has no dedicated roadmap yet) it falls back to a frontend roadmap, then to
 * the first available one, so enroll always has a valid target.
 */
export function matchMasterRoadmap(
  role: string | undefined,
  roadmaps: BrowseRoadmap[],
): BrowseRoadmap | undefined {
  if (roadmaps.length === 0) return undefined
  const key = (role ?? '').toLowerCase()
  const byRole = key && roadmaps.find((r) => r.roleName.toLowerCase().includes(key))
  return (
    byRole || roadmaps.find((r) => r.roleName.toLowerCase().includes('frontend')) || roadmaps[0]
  )
}
