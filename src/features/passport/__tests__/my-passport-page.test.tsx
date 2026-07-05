import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MyPassportPage } from '../my-passport-page'
import { useMyPassport, usePublicPassport, useUpdatePassport } from '../hooks/use-passport'
import type { PublicPassport } from '../lib/passport-api'

vi.mock('../hooks/use-passport', () => ({
  useMyPassport: vi.fn(),
  usePublicPassport: vi.fn(),
  useUpdatePassport: vi.fn(),
}))

const passportFixture: PublicPassport = {
  username: 'thai-dev',
  level: 'BEGINNER',
  streak: 4,
  longestStreak: 9,
  verifiedTopics: [{ name: 'React Basics', masteryPct: 96 }],
  roadmaps: [
    { name: 'Frontend Web Developer', topicsCount: 4, verifiedCount: 1, isCompleted: false },
  ],
  completedCount: 1,
  totalCount: 4,
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <MyPassportPage />
    </MemoryRouter>,
  )

describe('MyPassportPage', () => {
  beforeEach(() => {
    vi.mocked(useUpdatePassport).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUpdatePassport>)
    ;(usePublicPassport as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })
  })

  it('offers the opt-in CTA while the passport is private (default OFF)', () => {
    ;(useMyPassport as Mock).mockReturnValue({
      data: { shareToken: null, isPublic: false, publicUrl: null },
      isLoading: false,
    })
    renderPage()

    expect(screen.getByText('Your passport is private')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Turn on public sharing' })).toBeInTheDocument()
    expect(screen.queryByText('Verified Skill Passport')).not.toBeInTheDocument()
  })

  it('previews the exact public passport once sharing is on', () => {
    ;(useMyPassport as Mock).mockReturnValue({
      data: { shareToken: 'tok123', isPublic: true, publicUrl: 'https://vora.app/p/tok123' },
      isLoading: false,
    })
    ;(usePublicPassport as Mock).mockReturnValue({
      data: passportFixture,
      isLoading: false,
      isError: false,
    })
    renderPage()

    expect(screen.getByText(/This passport is public/)).toBeInTheDocument()
    expect(screen.getByText('thai-dev')).toBeInTheDocument()
    expect(screen.getByText('React Basics')).toBeInTheDocument()
    expect(usePublicPassport).toHaveBeenCalledWith('tok123')
  })
})
