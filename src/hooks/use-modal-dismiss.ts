import { useEffect, useRef } from 'react'

/**
 * Modal a11y helper: closes on Escape, traps Tab focus inside the dialog, moves
 * initial focus into it, and restores focus to the previously-focused element when
 * it unmounts. Attach the returned ref to the dialog container.
 */
export function useModalDismiss(onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Keep the latest onClose in a ref so the trap effect can run ONCE (deps `[]`).
  // Modals pass a new inline-arrow onClose each parent render; depending on it would
  // tear the effect down + re-run it, re-focusing the first control and yanking focus
  // off an input (e.g. the edit-profile name field) mid-typing.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const container = containerRef.current

    const getFocusable = (): HTMLElement[] => {
      if (!container) return []
      return Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, input, a[href], select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
        // Skip disabled and non-rendered controls (e.g. the hidden file input).
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null)
    }

    // Move focus into the dialog so keyboard + screen-reader users start inside it.
    getFocusable()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !container) return
      const focusables = getFocusable()
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (!container.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
    // Set up once on mount; a parent re-render (new inline onClose) must not re-run this.
  }, [])

  return containerRef
}
