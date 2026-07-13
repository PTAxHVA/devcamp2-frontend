import type { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import EditCurrentRoadmapPage from '../edit-current-roadmap-page'
import { useMasterRoadmap } from '@/features/roadmap/hooks/use-master-roadmap'

// jsdom lacks ResizeObserver, which FitViewController (rendered inside <ReactFlow>) uses.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub)

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => vi.fn(), useParams: () => ({ id: 'ur1' }) }
})

// Stub React Flow: render each node as a button so we can click it and read its
// greyed flag. Records the Controls props so we can assert the lock button is gone.
type FlowNode = { id: string; data: { label: string; greyed?: boolean } }
const controlsProps: { showInteractive?: boolean } = {}
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({
    nodes,
    onNodeClick,
    children,
  }: {
    nodes: FlowNode[]
    onNodeClick?: (e: React.MouseEvent, n: FlowNode) => void
    children?: ReactNode
  }) => (
    <div>
      {nodes.map((n) => (
        <button
          key={n.id}
          data-testid={`node-${n.id}`}
          data-greyed={String(!!n.data.greyed)}
          onClick={(e) => onNodeClick?.(e, n)}
        >
          {n.data.label}
        </button>
      ))}
      {children}
    </div>
  ),
  Background: () => null,
  Controls: (props: { showInteractive?: boolean }) => {
    controlsProps.showInteractive = props.showInteractive
    return null
  },
  useReactFlow: () => ({ fitView: vi.fn() }),
}))

const enrolledTopic = (
  id: string,
  name: string,
  orderIndex: number,
  status: string,
  sectionCompleted: number,
  prerequisiteTopicIds: string[],
) => ({
  masterTopicId: id,
  name,
  status,
  orderIndex,
  estimatedHours: 5,
  sectionTotal: 4,
  sectionCompleted,
  prerequisiteTopicIds,
})

// Enrolled on the React + Tailwind path.
vi.mock('@/features/roadmap/hooks/use-roadmap-detail', () => ({
  useRoadmapDetail: () => ({
    data: {
      roadmap: { masterRoadmapId: 'mr1', userRoadmapId: 'ur1' },
      topics: [
        enrolledTopic('dev', 'Dev Setup', 0, 'completed', 2, []),
        enrolledTopic('ts', 'TypeScript', 1, 'in_progress', 1, ['dev']),
        enrolledTopic('react', 'React', 2, 'available', 0, ['ts']),
        enrolledTopic('nextjs', 'Next.js', 3, 'locked', 0, ['react']),
        enrolledTopic('tailwind', 'Tailwind CSS', 6, 'locked', 0, ['react']),
      ],
      edges: [],
    },
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('@/features/roadmap/hooks/use-master-roadmap', () => ({ useMasterRoadmap: vi.fn() }))

// Branch metadata (the /master-roadmaps/:id query). Set per-test so the "still
// loading" path can be exercised by returning `{ data: undefined }`.
const BRANCHES = [
  { _id: 'b-core', name: 'Core', isMandatory: true, orderIndex: 0, topicCount: 2, topicIds: ['dev', 'ts'] }, // prettier-ignore
  { _id: 'b-react', name: 'React', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 0, topicCount: 2, topicIds: ['react', 'nextjs'] }, // prettier-ignore
  { _id: 'b-vue', name: 'Vue', selectionGroup: 'UI Framework', isMutuallyExclusive: true, orderIndex: 1, topicCount: 2, topicIds: ['vue', 'vuex'] }, // prettier-ignore
  { _id: 'b-tailwind', name: 'Tailwind CSS', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 0, topicCount: 1, topicIds: ['tailwind'] }, // prettier-ignore
  { _id: 'b-bootstrap', name: 'Bootstrap', selectionGroup: 'Styling', isMutuallyExclusive: true, orderIndex: 1, topicCount: 1, topicIds: ['bootstrap'] }, // prettier-ignore
]

// All-branches graph adds Vue + Bootstrap (not enrolled → greyed).
vi.mock('@/features/roadmap/hooks/use-master-roadmap-graph', () => ({
  useMasterRoadmapGraph: () => ({
    data: {
      topics: [
        enrolledTopic('dev', 'Dev Setup', 0, 'available', 0, []),
        enrolledTopic('ts', 'TypeScript', 1, 'locked', 0, ['dev']),
        enrolledTopic('react', 'React', 2, 'locked', 0, ['ts']),
        enrolledTopic('nextjs', 'Next.js', 3, 'locked', 0, ['react']),
        enrolledTopic('vue', 'Vue', 4, 'locked', 0, ['ts']),
        enrolledTopic('vuex', 'Vuex', 5, 'locked', 0, ['vue']),
        enrolledTopic('tailwind', 'Tailwind CSS', 6, 'locked', 0, ['react']),
        enrolledTopic('bootstrap', 'Bootstrap', 7, 'locked', 0, ['react']),
      ],
      edges: [],
    },
    isFetching: false,
  }),
}))

const patchMock = vi.fn().mockResolvedValue({ data: {} })
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    post: vi.fn().mockResolvedValue({ data: { data: { feedback: 'ok', severity: 'info', source: 'ai' } } }), // prettier-ignore
    patch: (...args: unknown[]) => patchMock(...args),
  },
}))

const renderPage = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
    >
      <MemoryRouter>
        <EditCurrentRoadmapPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )

const node = (id: string) => screen.getByTestId(`node-${id}`)
const greyed = (id: string) => node(id).getAttribute('data-greyed')
const btn = (name: RegExp) => screen.getByRole('button', { name })

beforeEach(() => {
  patchMock.mockClear()
  ;(useMasterRoadmap as unknown as Mock).mockReturnValue({ data: { branches: BRANCHES } })
})

describe('EditCurrentRoadmapPage — full graph + membership', () => {
  it('shows every branch, greying the not-enrolled topics; the lock button is removed', () => {
    renderPage()
    expect(node('vue')).toBeInTheDocument()
    expect(node('bootstrap')).toBeInTheDocument()
    expect(greyed('vue')).toBe('true')
    expect(greyed('bootstrap')).toBe('true')
    expect(greyed('react')).toBe('false')
    expect(greyed('tailwind')).toBe('false')
    // showInteractive={false} — no lock button in the Controls.
    expect(controlsProps.showInteractive).toBe(false)
  })

  it('clicking a greyed topic opens details with Add enabled and Remove disabled', () => {
    renderPage()
    fireEvent.click(node('vue'))
    expect(screen.getByText('Not added yet')).toBeInTheDocument()
    expect(btn(/add topic/i)).toBeEnabled()
    expect(btn(/remove topic/i)).toBeDisabled()
  })

  it('adds a greyed topic in place, enables Save; Undo reverts it and disables Save', async () => {
    renderPage()
    expect(btn(/save changes/i)).toBeDisabled()
    expect(btn(/undo/i)).toBeDisabled()

    fireEvent.click(node('vue'))
    fireEvent.click(btn(/add topic/i))

    await waitFor(() => expect(greyed('vue')).toBe('false')) // un-greyed in place
    expect(btn(/save changes/i)).toBeEnabled()
    expect(btn(/undo/i)).toBeEnabled()

    fireEvent.click(btn(/undo/i))
    await waitFor(() => expect(greyed('vue')).toBe('true')) // back to greyed
    expect(btn(/save changes/i)).toBeDisabled()
  })

  it('saves the exact add diff via PATCH', async () => {
    renderPage()
    fireEvent.click(node('vue'))
    fireEvent.click(btn(/add topic/i))
    await waitFor(() => expect(greyed('vue')).toBe('false'))
    fireEvent.click(btn(/save changes/i))
    await waitFor(() =>
      expect(patchMock).toHaveBeenCalledWith('/roadmaps/ur1', {
        addTopicIds: ['vue'],
        removeTopicIds: [],
      }),
    )
  })

  it('blocks removing a started topic and a topic another enrolled topic requires', () => {
    renderPage()
    // TypeScript is in progress → cannot be removed.
    fireEvent.click(node('ts'))
    expect(btn(/remove topic/i)).toBeDisabled()
    expect(screen.getByText(/already started this topic/i)).toBeInTheDocument()

    // React is required by Next.js + Tailwind → cannot be removed.
    fireEvent.click(node('react'))
    expect(btn(/remove topic/i)).toBeDisabled()
    expect(screen.getByText(/Required by/i)).toBeInTheDocument()
  })

  it('removes a clean enrolled leaf in place (greys it) and queues the remove diff', async () => {
    renderPage()
    fireEvent.click(node('nextjs')) // enrolled, no progress, nothing depends on it
    fireEvent.click(btn(/remove topic/i))
    await waitFor(() => expect(greyed('nextjs')).toBe('true'))
    fireEvent.click(btn(/save changes/i))
    await waitFor(() =>
      expect(patchMock).toHaveBeenCalledWith('/roadmaps/ur1', {
        addTopicIds: [],
        removeTopicIds: ['nextjs'],
      }),
    )
  })

  it('blocks adding a continuation topic until its branch head is enrolled', () => {
    renderPage()
    // Vuex continues the Vue branch, but Vue is not enrolled (learner is on React).
    fireEvent.click(node('vuex'))
    expect(btn(/add topic/i)).toBeDisabled()
    expect(screen.getByText(/Add Vue first/i)).toBeInTheDocument()
    // The Vue fork head itself is freely addable (a parallel branch).
    fireEvent.click(node('vue'))
    expect(btn(/add topic/i)).toBeEnabled()
  })

  it('holds Add until branch metadata loads (no head-less continuation add)', () => {
    // The graph resolved (greyed topics render) but the branch metadata has not, so
    // add-eligibility can't be evaluated yet — Add is held rather than left open.
    ;(useMasterRoadmap as unknown as Mock).mockReturnValue({ data: undefined })
    renderPage()
    fireEvent.click(node('vue'))
    expect(btn(/add topic/i)).toBeDisabled()
    expect(screen.getByText(/loading the roadmap paths/i)).toBeInTheDocument()
  })
})
