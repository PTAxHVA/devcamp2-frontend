import { type ComponentProps } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import RoadmapPreviewModal from '../roadmap-preview-modal'

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

// A forked master roadmap (Database: MongoDB vs PostgreSQL) so BranchTree renders
// its radio set — the enrolled/not-enrolled read-only behavior is what we assert.
vi.mock('../../hooks/use-master-roadmap', () => ({
  useMasterRoadmap: () => ({
    data: {
      roleName: 'Backend Developer',
      description: 'Curated path.',
      branches: [
        { _id: 'core', name: 'Core', isMandatory: true, orderIndex: 0, topicCount: 2, topicIds: ['t-node', 't-express'] }, // prettier-ignore
        { _id: 'mongo', name: 'MongoDB', selectionGroup: 'Database', isMutuallyExclusive: true, orderIndex: 1, topicCount: 1, topicIds: ['t-mongo'] }, // prettier-ignore
        { _id: 'pg', name: 'PostgreSQL', selectionGroup: 'Database', isMutuallyExclusive: true, orderIndex: 2, topicCount: 1, topicIds: ['t-pg'] }, // prettier-ignore
      ],
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
  }),
}))

// The enrolled user is on the PostgreSQL path (NOT the MongoDB default). The hook
// is disabled (no id) when not enrolled, so it returns no data then.
vi.mock('../../hooks/use-roadmap-detail', () => ({
  useRoadmapDetail: (id: string) => ({
    data: id
      ? {
          roadmap: {},
          topics: [
            { masterTopicId: 't-node' },
            { masterTopicId: 't-express' },
            { masterTopicId: 't-pg' },
          ],
          edges: [],
        }
      : undefined,
  }),
}))

const enrollMutate = vi.fn()
vi.mock('../../hooks/use-enroll-roadmap', () => ({
  useEnrollRoadmap: () => ({ mutate: enrollMutate, isPending: false }),
}))

const renderModal = (props: Partial<ComponentProps<typeof RoadmapPreviewModal>>) =>
  render(
    <MemoryRouter>
      <RoadmapPreviewModal
        roadmapId="master-backend"
        roleName="Backend Developer"
        onClose={() => {}}
        {...props}
      />
    </MemoryRouter>,
  )

describe('RoadmapPreviewModal action button', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    enrollMutate.mockReset()
  })

  it('enrolled: shows "Edit Roadmap" and opens the editor by user-roadmap id', () => {
    renderModal({ isEnrolled: true, userRoadmapId: 'ur-1' })

    fireEvent.click(screen.getByRole('button', { name: /edit roadmap/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/roadmaps/ur-1/edit')
  })

  it('not enrolled: shows the enroll button, never "Edit Roadmap"', () => {
    renderModal({ isEnrolled: false })

    expect(screen.getByRole('button', { name: /use roadmap/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /edit roadmap/i })).toBeNull()
  })
})

describe('RoadmapPreviewModal branch picker', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    enrollMutate.mockReset()
  })

  it('enrolled: read-only picker reflects the REAL branch (PostgreSQL), not the default', () => {
    renderModal({ isEnrolled: true, userRoadmapId: 'ur-1' })

    expect(screen.getByText('Learning paths')).toBeInTheDocument()
    // "choose one" implies a live choice — gone in the read-only preview.
    expect(screen.queryByText('choose one')).not.toBeInTheDocument()

    const [mongoRadio, pgRadio] = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(mongoRadio).toBeDisabled()
    expect(pgRadio).toBeDisabled()
    // The learner switched to PostgreSQL — highlight the real path, not the MongoDB default.
    expect(pgRadio.checked).toBe(true)
    expect(mongoRadio.checked).toBe(false)
  })

  it('not enrolled: interactive picker defaults to the group default and toggles', () => {
    renderModal({ isEnrolled: false })

    expect(screen.getByText('Choose your learning path')).toBeInTheDocument()
    expect(screen.getByText('choose one')).toBeInTheDocument()
    const [mongoRadio, pgRadio] = screen.getAllByRole('radio') as HTMLInputElement[]
    // Default selection is the first branch of the exclusive group (MongoDB).
    expect(mongoRadio.checked).toBe(true)
    expect(pgRadio.checked).toBe(false)
    expect(pgRadio).toBeEnabled()

    fireEvent.click(pgRadio)
    // Radio semantics: selecting PostgreSQL swaps the group selection — proves it's live.
    expect((screen.getAllByRole('radio')[1] as HTMLInputElement).checked).toBe(true)
  })
})
