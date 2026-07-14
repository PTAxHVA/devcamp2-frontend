import { describe, it, expect, vi } from 'vitest'
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

  it('restarts the fade (remove → re-add) on navigation without remounting the shell', () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter initialEntries={['/a']}>
        <Shell />
      </MemoryRouter>,
    )
    const shell = getByTestId('shell')
    const removeSpy = vi.spyOn(shell.classList, 'remove')
    const addSpy = vi.spyOn(shell.classList, 'add')

    fireEvent.click(getByText('go'))

    // Same DOM node across navigation → the routed page swapped without remounting the shell.
    expect(getByTestId('shell')).toBe(shell)
    // The remove → reflow → add sequence ran, restarting the CSS animation.
    expect(removeSpy).toHaveBeenCalledWith('animate-route-fade')
    expect(addSpy).toHaveBeenCalledWith('animate-route-fade')
    expect(shell.classList.contains('animate-route-fade')).toBe(true)
  })
})
