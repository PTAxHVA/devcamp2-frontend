import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { apiClient } from '@/lib/api-client'
import { TopicPreviewPanel } from '../components/topic-preview-panel'

vi.mock('@/lib/api-client', () => ({ apiClient: { get: vi.fn() } }))

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

const mockInfo = (info: Record<string, unknown>) =>
  (apiClient.get as Mock).mockResolvedValue({ data: { data: info } })

describe('TopicPreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the why-learn line and the section names', async () => {
    mockInfo({
      _id: 't1',
      name: 'React',
      description: 'A UI library.',
      whyLearn: 'Build interactive UIs faster.',
      estimatedHours: 10,
      sectionList: [
        { _id: 's1', name: 'useState', contentOverview: '', orderIndex: 0 },
        { _id: 's2', name: 'useEffect', contentOverview: '', orderIndex: 1 },
      ],
    })

    render(<TopicPreviewPanel topicId="t1" topicName="React" onClose={() => {}} />, { wrapper })

    expect(await screen.findByText('Build interactive UIs faster.')).toBeTruthy()
    expect(screen.getByText('useState')).toBeTruthy()
    expect(screen.getByText('useEffect')).toBeTruthy()
    expect(screen.getByText(/10 hrs/)).toBeTruthy()
  })

  it('degrades to the description when whyLearn is empty, and notes empty sections', async () => {
    mockInfo({
      _id: 't1',
      name: 'React',
      description: 'A UI library.',
      whyLearn: '',
      estimatedHours: 0,
      sectionList: [],
    })

    render(<TopicPreviewPanel topicId="t1" topicName="React" onClose={() => {}} />, { wrapper })

    expect(await screen.findByText('A UI library.')).toBeTruthy()
    expect(screen.getByText(/coming soon/i)).toBeTruthy()
  })
})
