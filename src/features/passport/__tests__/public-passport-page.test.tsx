import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { PublicPassportPage } from '../public-passport-page'
import { fetchPublicPassport, type PublicPassport } from '../lib/passport-api'

vi.mock('../lib/passport-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/passport-api')>()
  return { ...actual, fetchPublicPassport: vi.fn() }
})

const mockedFetch = vi.mocked(fetchPublicPassport)

const passportFixture: PublicPassport = {
  username: 'thai-dev',
  level: 'BEGINNER',
  streak: 4,
  longestStreak: 9,
  verifiedTopics: [
    { name: 'React Basics', masteryPct: 96 },
    { name: 'JavaScript Fundamentals', masteryPct: 88 },
  ],
  roadmaps: [{ name: 'Frontend Web Developer' }],
  completedCount: 2,
  totalCount: 4,
}

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/p/tok123']}>
        <Routes>
          <Route path="/p/:shareToken" element={<PublicPassportPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PublicPassportPage', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
  })

  it('renders one badge per verified topic with its mastery, plus gauge and identity', async () => {
    mockedFetch.mockResolvedValue(passportFixture)
    renderPage()

    expect(await screen.findByText('thai-dev')).toBeInTheDocument()
    expect(mockedFetch).toHaveBeenCalledWith('tok123')

    // Badges from the payload
    expect(screen.getByText('React Basics')).toBeInTheDocument()
    expect(screen.getByText(/96% mastery/)).toBeInTheDocument()
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
    expect(screen.getByText(/88% mastery/)).toBeInTheDocument()

    // Gauge: 2 of 4 topics verified → 50%
    expect(screen.getByRole('progressbar')).toHaveTextContent('50%')
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Frontend Web Developer')).toBeInTheDocument()
  })

  it('shows the not-found state instead of redirecting when the link is invalid or private', async () => {
    mockedFetch.mockRejectedValue(new Error('Request failed with status code 404'))
    renderPage()

    expect(await screen.findByText('Passport not found')).toBeInTheDocument()
    expect(
      screen.getByText(/doesn't exist or its owner has turned sharing off/i),
    ).toBeInTheDocument()
  })

  it('renders the empty-badges hint for a passport with no verified topics yet', async () => {
    mockedFetch.mockResolvedValue({
      ...passportFixture,
      verifiedTopics: [],
      completedCount: 0,
      totalCount: 0,
    })
    renderPage()

    expect(await screen.findByText(/No verified skills yet/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveTextContent('0%')
  })
})
