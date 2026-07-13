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
})
