import { useState } from 'react'
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
  const close = () => setOpen(false)

  return (
    <header className="border-border-soft sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md backdrop-saturate-150">
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
