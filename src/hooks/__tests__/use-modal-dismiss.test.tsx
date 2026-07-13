import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { useModalDismiss } from '../use-modal-dismiss'

function Dialog({ onClose }: { onClose: () => void }) {
  const ref = useModalDismiss(onClose)
  return (
    <div ref={ref}>
      <button>ok</button>
    </div>
  )
}

describe('useModalDismiss', () => {
  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    render(<Dialog onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('ignores other keys', () => {
    const onClose = vi.fn()
    render(<Dialog onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'a' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('routes Escape to the latest onClose after a re-render (no stale closure)', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = render(<Dialog onClose={first} />)
    rerender(<Dialog onClose={second} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })
})
