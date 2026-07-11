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

// Keep the preview offline: a fixed master roadmap with no branches renders the
// footer buttons (what we assert) without hitting the network or BranchTree.
vi.mock('../../hooks/use-master-roadmap', () => ({
  useMasterRoadmap: () => ({
    data: { roleName: 'Frontend Developer', description: 'Curated path.', branches: [] },
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
        roadmapId="master-frontend"
        roleName="Frontend Developer"
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
