import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepLearningPath } from '../components/steps/path'
import { useWizardStore } from '../onboarding-store'

describe('StepLearningPath — "recommend one" option (H)', () => {
  beforeEach(() => {
    localStorage.clear()
    useWizardStore.getState().resetWizard()
  })

  it('offers a recommend card on both the framework and styling steps', () => {
    render(<StepLearningPath />)
    expect(screen.getAllByText('Not sure yet')).toHaveLength(2)
  })

  it('stores the "auto" sentinel when the framework recommend card is chosen', () => {
    render(<StepLearningPath />)
    // The first recommend card belongs to the framework section.
    fireEvent.click(screen.getAllByText('Not sure yet')[0])
    expect(useWizardStore.getState().answers.learningFramework).toBe('auto')
  })
})
