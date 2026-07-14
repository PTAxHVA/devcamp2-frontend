import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router'
import { useRouteFade } from '../use-route-fade'

function Nav() {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/b')}>go</button>
}

function Shell() {
  const ref = useRouteFade<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="shell">
      <Routes>
        <Route path="/a" element={<Nav />} />
        <Route path="/b" element={<span>B page</span>} />
      </Routes>
    </div>
  )
}

describe('useRouteFade', () => {
  it('applies the fade class to the element on mount', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Shell />
      </MemoryRouter>,
    )
    expect(getByTestId('shell').classList.contains('animate-route-fade')).toBe(true)
  })

  it('keeps the same element (no remount) and re-applies the fade on navigation', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Shell />
      </MemoryRouter>,
    )
    const before = getByTestId('shell')
    fireEvent.click(getByText('go'))
    const after = getByTestId('shell')
    // Same DOM node across navigation → the routed page swapped without remounting the shell.
    expect(after).toBe(before)
    expect(after.classList.contains('animate-route-fade')).toBe(true)
  })
})
