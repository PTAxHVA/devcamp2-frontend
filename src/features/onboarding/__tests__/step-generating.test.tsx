import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { apiClient } from '@/lib/api-client'
import { StepGenerating, DEFAULT_REASON } from '../components/steps/generate'
import { useWizardStore } from '../onboarding-store'

vi.mock('@/lib/api-client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

const MASTER = { _id: 'm1', roleName: 'Frontend Web' }
const DETAIL = { _id: 'm1', roleName: 'Frontend Web', branches: [{ _id: 'b1' }, { _id: 'b2' }] }
const SUGGESTED_TOPICS = [
  { id: 't1', name: 'HTML Fundamentals' },
  { id: 't2', name: 'CSS Fundamentals' },
]
const EXPLANATION = 'Since you want your first dev job, we start with the visual building blocks.'

const envelope = <T,>(data: T) => ({ data: { success: true, data } })

const mockHappyGets = () => {
  ;(apiClient.get as Mock).mockImplementation((url: string) => {
    if (url === '/master-roadmaps') return Promise.resolve(envelope([MASTER]))
    if (url === '/master-roadmaps/m1') return Promise.resolve(envelope(DETAIL))
    return Promise.reject(new Error(`unexpected GET ${url}`))
  })
}

const mockPosts = (suggest: () => Promise<unknown>) => {
  ;(apiClient.post as Mock).mockImplementation((url: string) => {
    if (url === '/onboarding/questionnaire') return Promise.resolve(envelope({}))
    if (url === '/ai/roadmap-suggest') return suggest()
    return Promise.reject(new Error(`unexpected POST ${url}`))
  })
}

const renderStep = (onContinue = vi.fn()) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  render(<StepGenerating onContinue={onContinue} minDwellMs={0} />, { wrapper })
  return onContinue
}

describe('StepGenerating', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useWizardStore.setState({
      step: 6,
      answers: { role: 'frontend', goal: 'job', level: 'beginner' },
      suggestion: null,
    })
  })

  it('reveals the AI reason and topic order, and pins the suggestion on Continue', async () => {
    mockHappyGets()
    mockPosts(() =>
      Promise.resolve(
        envelope({ suggestedTopics: SUGGESTED_TOPICS, explanation: EXPLANATION, source: 'ai' }),
      ),
    )
    const onContinue = renderStep()

    expect(await screen.findByText(EXPLANATION)).toBeInTheDocument()
    expect(screen.getByText('HTML Fundamentals')).toBeInTheDocument()
    expect(screen.getByText('CSS Fundamentals')).toBeInTheDocument()

    // The questionnaire must be saved before the AI reads it server-side.
    const postUrls = (apiClient.post as Mock).mock.calls.map((call) => call[0])
    expect(postUrls).toEqual(['/onboarding/questionnaire', '/ai/roadmap-suggest'])

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(onContinue).toHaveBeenCalledTimes(1)
    expect(useWizardStore.getState().suggestion).toEqual({
      masterRoadmapId: 'm1',
      branchIds: ['b1', 'b2'],
      orderedTopicIds: ['t1', 't2'],
      topics: SUGGESTED_TOPICS,
      explanation: EXPLANATION,
      source: 'ai',
    })
  })

  it('shows the default copy (not the internal notice) when the server degraded to fallback', async () => {
    mockHappyGets()
    // Gemini down server-side → 200 with default order + an internal notice.
    mockPosts(() =>
      Promise.resolve(
        envelope({
          suggestedTopics: SUGGESTED_TOPICS,
          explanation: 'AI is currently not available, showing the default roadmap',
          source: 'fallback',
        }),
      ),
    )
    renderStep()

    expect(await screen.findByText(DEFAULT_REASON)).toBeInTheDocument()
    expect(
      screen.queryByText('AI is currently not available, showing the default roadmap'),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/AI personalization is busy right now/)).toBeInTheDocument()
    // The (default) order is still valid and shown.
    expect(screen.getByText('HTML Fundamentals')).toBeInTheDocument()
  })

  it('shows the default reason when the server sends no usable explanation', async () => {
    mockHappyGets()
    // Defensive path: a null explanation must degrade, never crash the reveal.
    mockPosts(() =>
      Promise.resolve(envelope({ suggestedTopics: SUGGESTED_TOPICS, explanation: null })),
    )
    renderStep()

    expect(await screen.findByText(DEFAULT_REASON)).toBeInTheDocument()
    // The AI order itself is still valid and shown.
    expect(screen.getByText('HTML Fundamentals')).toBeInTheDocument()
  })

  it('falls back to the default reason when the suggestion request fails', async () => {
    mockHappyGets()
    mockPosts(() => Promise.reject(new Error('AI unavailable')))
    const onContinue = renderStep()

    expect(await screen.findByText(DEFAULT_REASON)).toBeInTheDocument()
    expect(screen.queryByText(/your learning order/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(onContinue).toHaveBeenCalledTimes(1)
    // Enroll must fall back to the server's default order.
    expect(useWizardStore.getState().suggestion).toBeNull()
  })

  it('keeps the working state (no Continue) until the request settles', async () => {
    mockHappyGets()
    mockPosts(() => new Promise(() => {})) // never resolves
    renderStep()

    expect(await screen.findByText(/personalizing your roadmap/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
  })
})
