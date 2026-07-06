import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import type { ReactNode } from 'react'
import { apiClient, extractApiError } from '@/lib/api-client'
import { useCompleteOnboarding, suggestionMatchesTarget } from '../hooks/use-complete-onboarding'
import { useWizardStore, type RoadmapSuggestion } from '../onboarding-store'

vi.mock('@/lib/api-client', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
  extractApiError: vi.fn(() => ({ code: undefined, message: undefined })),
}))

const MASTER = { _id: 'm1', roleName: 'Frontend Web' }
const DETAIL = { _id: 'm1', roleName: 'Frontend Web', branches: [{ _id: 'b1' }, { _id: 'b2' }] }

const SUGGESTION: RoadmapSuggestion = {
  masterRoadmapId: 'm1',
  branchIds: ['b1', 'b2'],
  orderedTopicIds: ['t2', 't1'],
  topics: [
    { id: 't2', name: 'CSS Fundamentals' },
    { id: 't1', name: 'HTML Fundamentals' },
  ],
  explanation: 'CSS first suits your project goal.',
}

const envelope = <T,>(data: T) => ({ data: { success: true, data } })

const mockGets = () => {
  ;(apiClient.get as Mock).mockImplementation((url: string) => {
    if (url === '/master-roadmaps') return Promise.resolve(envelope([MASTER]))
    if (url === '/master-roadmaps/m1') return Promise.resolve(envelope(DETAIL))
    return Promise.reject(new Error(`unexpected GET ${url}`))
  })
}

/** Mock POSTs; `enrollResults` are consumed one per POST /roadmaps call. */
const mockPosts = (enrollResults: Array<() => Promise<unknown>>) => {
  const queue = [...enrollResults]
  ;(apiClient.post as Mock).mockImplementation((url: string) => {
    if (url === '/onboarding/questionnaire') return Promise.resolve(envelope({}))
    if (url === '/roadmaps') {
      const next = queue.shift()
      return next ? next() : Promise.reject(new Error('unexpected extra POST /roadmaps'))
    }
    return Promise.reject(new Error(`unexpected POST ${url}`))
  })
}

const enrollCalls = () =>
  (apiClient.post as Mock).mock.calls.filter((call) => call[0] === '/roadmaps')

const runMutation = async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
  const { result } = renderHook(() => useCompleteOnboarding(), { wrapper })
  act(() => result.current.mutate('accept'))
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
}

describe('suggestionMatchesTarget', () => {
  it('accepts a suggestion computed for the same roadmap and branch set', () => {
    expect(suggestionMatchesTarget(SUGGESTION, 'm1', ['b2', 'b1'])).toBe(true)
  })

  it('rejects null, another roadmap, or a different branch set', () => {
    expect(suggestionMatchesTarget(null, 'm1', ['b1', 'b2'])).toBe(false)
    expect(suggestionMatchesTarget(SUGGESTION, 'other', ['b1', 'b2'])).toBe(false)
    expect(suggestionMatchesTarget(SUGGESTION, 'm1', ['b1'])).toBe(false)
    expect(suggestionMatchesTarget(SUGGESTION, 'm1', ['b1', 'b3'])).toBe(false)
  })
})

describe('useCompleteOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(extractApiError as Mock).mockReturnValue({ code: undefined, message: undefined })
    useWizardStore.setState({ step: 7, answers: { role: 'frontend' }, suggestion: null })
    mockGets()
  })

  it('attaches the pinned AI order to enroll when the suggestion matches', async () => {
    useWizardStore.setState({ suggestion: SUGGESTION })
    mockPosts([() => Promise.resolve(envelope({ _id: 'ur1' }))])

    await runMutation()

    expect(enrollCalls()).toHaveLength(1)
    expect(enrollCalls()[0][1]).toEqual({
      masterRoadmapId: 'm1',
      branchSelections: ['b1', 'b2'],
      sourceType: 'SUGGESTED',
      orderedTopicIds: ['t2', 't1'],
    })
  })

  it('enrolls with the default order when there is no suggestion (degrade path)', async () => {
    mockPosts([() => Promise.resolve(envelope({ _id: 'ur1' }))])

    await runMutation()

    expect(enrollCalls()).toHaveLength(1)
    expect(enrollCalls()[0][1]).toEqual({
      masterRoadmapId: 'm1',
      branchSelections: ['b1', 'b2'],
      sourceType: 'SUGGESTED',
    })
  })

  it('drops a stale suggestion computed for a different roadmap', async () => {
    useWizardStore.setState({ suggestion: { ...SUGGESTION, masterRoadmapId: 'other' } })
    mockPosts([() => Promise.resolve(envelope({ _id: 'ur1' }))])

    await runMutation()

    expect(enrollCalls()).toHaveLength(1)
    expect(enrollCalls()[0][1]).not.toHaveProperty('orderedTopicIds')
  })

  it('does not retry when enroll fails for any other reason', async () => {
    useWizardStore.setState({ suggestion: SUGGESTION })
    ;(extractApiError as Mock).mockReturnValue({
      code: 'RATE_LIMITED',
      message: 'Too many requests',
    })
    mockPosts([() => Promise.reject(new Error('429 RATE_LIMITED'))])

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useCompleteOnboarding(), { wrapper })
    act(() => result.current.mutate('accept'))
    await waitFor(() => expect(result.current.isError).toBe(true))

    // The single retry is reserved for INVALID_TOPIC_ORDER — anything else
    // must propagate without a second enroll attempt (no double-submit).
    expect(enrollCalls()).toHaveLength(1)
  })

  it('retries once without the AI order when the server rejects it', async () => {
    useWizardStore.setState({ suggestion: SUGGESTION })
    ;(extractApiError as Mock).mockReturnValue({
      code: 'INVALID_TOPIC_ORDER',
      message: 'A prerequisite topic is ordered after a topic that depends on it',
    })
    mockPosts([
      () => Promise.reject(new Error('400 INVALID_TOPIC_ORDER')),
      () => Promise.resolve(envelope({ _id: 'ur1' })),
    ])

    await runMutation()

    expect(enrollCalls()).toHaveLength(2)
    expect(enrollCalls()[0][1]).toHaveProperty('orderedTopicIds')
    expect(enrollCalls()[1][1]).not.toHaveProperty('orderedTopicIds')
  })
})
