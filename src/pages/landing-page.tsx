import { useEffect } from 'react'
import {
  CtaBand,
  FaqSection,
  FloatingStickers,
  Footer,
  HeroSection,
  HowItWorksSection,
  Navbar,
  SignatureFeaturesSection,
  StatsSection,
  WhyVoraSection,
} from '@/features/landing/components'
import { usePrefersReducedMotion } from '@/features/landing/lib/use-prefers-reduced-motion'

const LandingPage = () => {
  const reduced = usePrefersReducedMotion()

  // Smooth in-page anchor scrolling, scoped to this page and reverted on unmount so
  // other routes keep their default behavior. Driven by the LIVE reduced-motion
  // preference (re-runs if the user toggles it while the page is open). The 84px
  // sticky-navbar offset comes from `scroll-mt-[84px]` on each anchored section —
  // it is NOT also set here, so the offset never stacks.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = reduced ? 'auto' : 'smooth'
    return () => {
      html.style.scrollBehavior = prev
    }
  }, [reduced])

  // The landing is very tall, so navigating from a below-the-fold CTA (e.g. the
  // closing "Get Started") would otherwise leave the next route scrolled mid-page.
  // Reset scroll to the top when this page unmounts — forced instant so the
  // smooth-scroll style can't animate it after the route swaps.
  useEffect(() => {
    return () => {
      const html = document.documentElement
      const previousBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      html.style.scrollBehavior = previousBehavior
    }
  }, [])

  return (
    <div className="bg-bg-soft text-text-primary relative flex min-h-screen flex-col overflow-x-clip">
      <FloatingStickers reducedMotion={reduced} />
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyVoraSection />
        <HowItWorksSection />
        <SignatureFeaturesSection />
        <FaqSection />
        <CtaBand />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
