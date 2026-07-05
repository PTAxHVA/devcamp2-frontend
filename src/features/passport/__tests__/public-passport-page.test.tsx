import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
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
  roadmaps: [
    { name: 'Frontend Web Developer', topicsCount: 4, verifiedCount: 2, isCompleted: false },
  ],
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

    // No completed roadmap → no certificate section on the public page.
    expect(screen.queryByText('Certificate of Completion')).not.toBeInTheDocument()
  })

  it('renders a printable certificate on the public page for each completed roadmap', async () => {
    mockedFetch.mockResolvedValue({
      ...passportFixture,
      roadmaps: [
        { name: 'Backend Web Developer', topicsCount: 2, verifiedCount: 2, isCompleted: true },
        { name: 'Frontend Web Developer', topicsCount: 4, verifiedCount: 2, isCompleted: false },
      ],
    })
    renderPage()

    expect(await screen.findByText('Certificate of Completion')).toBeInTheDocument()
    expect(screen.getByText(/has completed the Backend Web Developer roadmap/)).toBeInTheDocument()
    // Only the COMPLETED roadmap earns a certificate.
    expect(
      screen.queryByText(/has completed the Frontend Web Developer roadmap/),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Print \/ save as PDF/ })).toBeInTheDocument()
  })

  it('shows the not-found state instead of redirecting when the link is invalid or private', async () => {
    const notFound = new AxiosError('Request failed with status code 404')
    notFound.response = { status: 404, data: {} } as AxiosResponse
    mockedFetch.mockRejectedValue(notFound)
    renderPage()

    expect(await screen.findByText('Passport not found')).toBeInTheDocument()
    expect(
      screen.getByText(/doesn't exist or its owner has turned sharing off/i),
    ).toBeInTheDocument()
  })

  it('shows a retryable loading-failure state (not "not found") for network/cold-start errors', async () => {
    mockedFetch.mockRejectedValue(
      new AxiosError('Network Error', 'ERR_NETWORK', { headers: new AxiosHeaders() }),
    )
    renderPage()

    // The hook retries non-404 failures twice (cold-start tolerance) before erroring.
    expect(
      await screen.findByText("Couldn't load this passport", undefined, { timeout: 8000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.queryByText('Passport not found')).not.toBeInTheDocument()
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
