import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepLearningPath } from '../components/steps/path'
import { useWizardStore } from '../onboarding-store'

const setRole = (role: string) => useWizardStore.getState().setAnswer('role', role)

describe('StepLearningPath', () => {
  beforeEach(() => {
    localStorage.clear()
    useWizardStore.getState().resetWizard()
  })

  describe('frontend / fullstack', () => {
    it('renders the framework, styling, and project sections (not database)', () => {
      setRole('frontend')
      render(<StepLearningPath />)
      expect(screen.getByText('Choose your framework')).toBeInTheDocument()
      expect(screen.getByText('Choose your styling preferences')).toBeInTheDocument()
      expect(screen.getByText('Choose your project direction')).toBeInTheDocument()
      expect(screen.queryByText('Choose your database')).not.toBeInTheDocument()
    })

    it('offers a recommend card on the framework and styling steps', () => {
      setRole('frontend')
      render(<StepLearningPath />)
      expect(screen.getAllByText('Not sure yet')).toHaveLength(2)
    })

    it('stores the "auto" sentinel when the framework recommend card is chosen', () => {
      setRole('frontend')
      render(<StepLearningPath />)
      // The first recommend card belongs to the framework section.
      fireEvent.click(screen.getAllByText('Not sure yet')[0])
      expect(useWizardStore.getState().answers.learningFramework).toBe('auto')
    })
  })

  describe('backend', () => {
    it('renders a single Database section in place of the frontend sections', () => {
      setRole('backend')
      render(<StepLearningPath />)
      expect(screen.getByText('Choose your database')).toBeInTheDocument()
      expect(screen.getByText('MongoDB')).toBeInTheDocument()
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
      expect(screen.getByText('MySQL')).toBeInTheDocument()
      expect(screen.getByText('Not sure yet')).toBeInTheDocument()
      expect(screen.queryByText('Choose your framework')).not.toBeInTheDocument()
      expect(screen.queryByText('Choose your styling preferences')).not.toBeInTheDocument()
      expect(screen.queryByText('Choose your project direction')).not.toBeInTheDocument()
    })

    it('stores the picked database id', () => {
      setRole('backend')
      render(<StepLearningPath />)
      fireEvent.click(screen.getByText('PostgreSQL'))
      expect(useWizardStore.getState().answers.database).toBe('postgresql')
    })

    it('stores the "auto" sentinel when the recommend card is chosen', () => {
      setRole('backend')
      render(<StepLearningPath />)
      fireEvent.click(screen.getByText('Not sure yet'))
      expect(useWizardStore.getState().answers.database).toBe('auto')
    })
  })
})
