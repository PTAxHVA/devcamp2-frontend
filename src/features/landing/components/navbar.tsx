import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { RiCloseLine, RiMenuLine } from 'react-icons/ri'
import { VoraWordmark } from '@/components/ui/vora-logo'
import { cn } from '@/lib/utils'
import { SHADOW_SOFT } from '../lib/landing-styles'

const NAV_LINKS = [
  { href: '#why', label: 'Why VORA' },
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
]

/**
 * Landing navbar. Inline links on desktop; below 900px they collapse into a
 * hamburger dropdown (the mockup's exact breakpoint). The primary CTA stays
 * visible at every width; the menu closes on any link tap.
 */
export const Navbar = () => {
  const [open, setOpen] = useState(false)
  // Lift the bar with a soft shadow once the page leaves the very top.
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 4,
  )
  const close = () => setOpen(false)
  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open, close it on Escape or a click/tap outside the
  // navbar. Links inside close it via their own onClick. Escape also returns focus
  // to the hamburger so keyboard focus never lands on the now-hidden menu.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <header
      ref={headerRef}
      className={cn(
        'border-border-soft sticky top-0 z-50 border-b backdrop-blur-md backdrop-saturate-150 transition-shadow duration-300',
        scrolled
          ? 'bg-white/95 shadow-[0_10px_30px_-18px_rgba(6,26,53,0.25)]'
          : 'bg-white/90 shadow-none',
      )}
    >
      <div className="mx-auto flex h-17 max-w-[1160px] items-center justify-between gap-3 px-5">
        <Link to="/" aria-label="VORA home" onClick={close}>
          <VoraWordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 min-[900px]:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary text-[0.95rem] font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className="btn btn-ghost hidden font-semibold min-[900px]:inline-flex">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary font-semibold">
            Get Started
          </Link>
          <button
            ref={burgerRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            onClick={() => setOpen((prev) => !prev)}
            className="border-border-soft text-text-primary inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border bg-white min-[900px]:hidden"
          >
            {open ? (
              <RiCloseLine aria-hidden className="h-[22px] w-[22px]" />
            ) : (
              <RiMenuLine aria-hidden className="h-[22px] w-[22px]" />
            )}
          </button>
        </div>
      </div>

      <div
        id="landing-mobile-menu"
        className={cn(
          'border-border-soft absolute inset-x-0 top-full flex-col gap-1 border-b bg-white px-5 pt-3 pb-4 min-[900px]:hidden',
          SHADOW_SOFT,
          open ? 'flex' : 'hidden',
        )}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={close}
            className="text-text-secondary hover:bg-bg-section hover:text-text-primary rounded-lg px-2 py-3 font-semibold transition-colors"
          >
            {link.label}
          </a>
        ))}
        <Link
          to="/login"
          onClick={close}
          className="text-text-secondary hover:bg-bg-section hover:text-text-primary rounded-lg px-2 py-3 font-semibold transition-colors"
        >
          Log in
        </Link>
        <Link to="/signup" onClick={close} className="btn btn-primary mt-2 font-semibold">
          Get Started
        </Link>
      </div>
    </header>
  )
}
