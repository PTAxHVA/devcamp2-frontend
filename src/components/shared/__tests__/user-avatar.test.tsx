import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserAvatar } from '../user-avatar'

describe('UserAvatar', () => {
  it('renders the silhouette when no src is given', () => {
    render(<UserAvatar name="Thai" />)
    const el = screen.getByRole('img', { name: /thai's avatar/i })
    expect(el.tagName).toBe('SPAN') // silhouette, not an <img>
  })

  it('renders the uploaded photo when src is given', () => {
    render(<UserAvatar src="data:image/png;base64,AAAA" name="Thai" />)
    const img = screen.getByRole('img', { name: /thai's avatar/i })
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', 'data:image/png;base64,AAAA')
  })

  it('falls back to the silhouette when the stored photo fails to load', () => {
    render(<UserAvatar src="data:image/png;base64,broken" name="Thai" />)
    fireEvent.error(screen.getByRole('img', { name: /thai's avatar/i }))
    expect(screen.getByRole('img', { name: /thai's avatar/i }).tagName).toBe('SPAN')
  })
})
