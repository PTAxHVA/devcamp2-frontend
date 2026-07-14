import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import OnboardingMain from '../components/onboarding-main'
import { useWizardStore } from '../onboarding-store'

// Step 6 (generating) fires the real AI suggestion query — keep it inert so these
// wizard-navigation tests never touch the network. Pending → the honest working state.
vi.mock('../hooks/use-roadmap-suggestion', () => ({
  useRoadmapSuggestion: () => ({ data: undefined, isPending: true }),
}))

// Every required preference question answered, so substep 1 validates and Continue advances.
const PREFS = {
  weeklyTime: '5-10',
  projectType: 'web',
  learningStyle: 'video',
  targetTimeline: '3-6',
  os: 'mac',
  cliComfort: 'beginner',
}

const seed = (step: number, answers: Record<string, string>) =>
  useWizardStore.setState({ step, answers, suggestion: null })

const renderOnboarding = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter>
        <OnboardingMain />
      </MemoryRouter>
    </QueryClientProvider>,
  )

const clickButton = (name: RegExp) => fireEvent.click(screen.getByRole('button', { name }))

describe('OnboardingMain — learning-path substep', () => {
  beforeEach(() => {
    localStorage.clear()
    useWizardStore.getState().resetWizard()
  })

  it('advances a backend learner from preferences to the Database card (not straight to generating)', () => {
    seed(5, { role: 'backend', ...PREFS })
    renderOnboarding()
    expect(screen.getByText('Personalize your learning experience')).toBeInTheDocument()
    clickButton(/Continue/i)
    expect(screen.getByText('Choose your database')).toBeInTheDocument()
    expect(screen.getByText('MongoDB')).toBeInTheDocument()
  })

  it('advances a frontend learner from preferences to the framework/styling/project cards', () => {
    seed(5, { role: 'frontend', ...PREFS })
    renderOnboarding()
    clickButton(/Continue/i)
    expect(screen.getByText('Choose your framework')).toBeInTheDocument()
    expect(screen.getByText('Choose your styling preferences')).toBeInTheDocument()
    expect(screen.queryByText('Choose your database')).not.toBeInTheDocument()
  })

  it('blocks a backend learner on the Database card until a database is chosen', () => {
    seed(5, { role: 'backend', ...PREFS })
    renderOnboarding()
    clickButton(/Continue/i)
    expect(screen.getByText('Choose your database')).toBeInTheDocument()

    // Try to advance with no database chosen — stays put + shows a validation message.
    clickButton(/Personalize Your Roadmap/i)
    expect(screen.getByText('Choose your database')).toBeInTheDocument()
    expect(screen.getByText(/Please complete this step before continuing/i)).toBeInTheDocument()

    // Pick a database → advancing now leaves the card for the generating step.
    fireEvent.click(screen.getByText('MongoDB'))
    clickButton(/Personalize Your Roadmap/i)
    expect(screen.queryByText('Choose your database')).not.toBeInTheDocument()
    expect(screen.getByText('Personalizing your roadmap')).toBeInTheDocument()
  })

  it('backend Back from the generating step returns to the Database card, then preferences', () => {
    seed(6, { role: 'backend', ...PREFS, database: 'mongodb' })
    renderOnboarding()
    expect(screen.getByText('Personalizing your roadmap')).toBeInTheDocument()

    clickButton(/Back/i)
    expect(screen.getByText('Choose your database')).toBeInTheDocument()

    clickButton(/Back/i)
    expect(screen.getByText('Personalize your learning experience')).toBeInTheDocument()
  })
})
