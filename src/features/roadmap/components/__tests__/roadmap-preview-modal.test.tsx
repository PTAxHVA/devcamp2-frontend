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
        { _id: 'core', name: 'Core', isMandatory: true, orderIndex: 0, topicCount: 3 },
        { _id: 'mongo', name: 'MongoDB', selectionGroup: 'Database', isMutuallyExclusive: true, orderIndex: 1, topicCount: 1 }, // prettier-ignore
        { _id: 'pg', name: 'PostgreSQL', selectionGroup: 'Database', isMutuallyExclusive: true, orderIndex: 2, topicCount: 1 }, // prettier-ignore
      ],
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: vi.fn(),
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

  it('enrolled: the picker is read-only (radios disabled) and reframed for the editor', () => {
    renderModal({ isEnrolled: true, userRoadmapId: 'ur-1' })

    expect(screen.getByText('Learning paths')).toBeInTheDocument()
    const radios = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(radios.length).toBeGreaterThan(0)
    radios.forEach((r) => expect(r).toBeDisabled())
  })

  it('not enrolled: the picker stays interactive (radio toggles the path)', () => {
    renderModal({ isEnrolled: false })

    expect(screen.getByText('Choose your learning path')).toBeInTheDocument()
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
