import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { RoadmapCompletePage } from '../roadmap-complete-page'

const mocks = vi.hoisted(() => ({ useRoadmapDetail: vi.fn(), useMe: vi.fn() }))

vi.mock('@/features/roadmap/hooks/use-roadmap-detail', () => ({
  useRoadmapDetail: mocks.useRoadmapDetail,
}))
vi.mock('@/features/profile/hooks/use-profile', () => ({ useMe: mocks.useMe }))
vi.mock('@/features/passport/components/certificate-card', () => ({
  CertificateCard: () => <div>certificate-stub</div>,
}))

type TopicSpec = { status?: string; sectionTotal: number; sectionCompleted: number }

function detail(topics: TopicSpec[]) {
  return {
    roadmap: { roleName: 'Frontend Developer' },
    topics: topics.map((t, i) => ({
      masterTopicId: `t${i}`,
      status: t.status ?? 'completed',
      sectionTotal: t.sectionTotal,
      sectionCompleted: t.sectionCompleted,
    })),
    edges: [],
  }
}

const setDetail = (topics: TopicSpec[]) =>
  mocks.useRoadmapDetail.mockReturnValue({ data: detail(topics), isLoading: false })

const renderAt = () =>
  render(
    <MemoryRouter initialEntries={['/roadmaps/rm1/complete']}>
      <Routes>
        <Route path="/roadmaps/:id/complete" element={<RoadmapCompletePage />} />
        <Route path="/roadmaps/:id" element={<div>roadmap-view</div>} />
        <Route path="/dashboard" element={<div>dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('RoadmapCompletePage', () => {
  beforeEach(() => {
    mocks.useMe.mockReturnValue({ data: { username: 'thai' } })
  })

  it('celebrates and renders the certificate when every topic is section-complete', () => {
    setDetail([
      { sectionTotal: 2, sectionCompleted: 2 },
      { sectionTotal: 3, sectionCompleted: 3 },
    ])
    renderAt()

    expect(screen.getByText(/Congratulations! You completed your roadmap/i)).toBeInTheDocument()
    expect(screen.getByText('certificate-stub')).toBeInTheDocument()
  })

  it('redirects away (no false celebration) when a topic still has sections left', () => {
    setDetail([
      { sectionTotal: 2, sectionCompleted: 2 },
      { sectionTotal: 2, sectionCompleted: 1 },
    ])
    renderAt()

    expect(screen.queryByText(/Congratulations/i)).not.toBeInTheDocument()
    expect(screen.getByText('roadmap-view')).toBeInTheDocument()
  })

  // These two guard the cross-hook consistency: the complete page reads the raw BE
  // status while my-learning re-derives it, so the gate must key off section
  // progress (not the status string) to agree with the CTA that navigates here.
  it('does not celebrate a topic whose status says completed but has sections left', () => {
    setDetail([{ status: 'completed', sectionTotal: 2, sectionCompleted: 0 }])
    renderAt()

    expect(screen.queryByText(/Congratulations/i)).not.toBeInTheDocument()
    expect(screen.getByText('roadmap-view')).toBeInTheDocument()
  })

  it('celebrates a topic whose sections are all done even if status still reads locked', () => {
    setDetail([{ status: 'locked', sectionTotal: 2, sectionCompleted: 2 }])
    renderAt()

    expect(screen.getByText(/Congratulations! You completed your roadmap/i)).toBeInTheDocument()
  })
})
