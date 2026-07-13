import { useEffect, useRef } from 'react'

/**
 * Modal a11y helper: closes on Escape, traps Tab focus inside the dialog, moves
 * initial focus into it, and restores focus to the previously-focused element when
 * it unmounts. Attach the returned ref to the dialog container.
 */
export function useModalDismiss(onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)

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
        onClose()
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
  }, [onClose])

  return containerRef
}
