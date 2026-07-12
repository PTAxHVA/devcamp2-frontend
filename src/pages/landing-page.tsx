import { useEffect } from 'react'
import {
  CtaBand,
  FaqSection,
  Footer,
  HeroSection,
  HowItWorksSection,
  Navbar,
  SignatureFeaturesSection,
  StatsSection,
  WhyVoraSection,
} from '@/features/landing/components'

const LandingPage = () => {
  // Smooth in-page anchor scrolling + a sticky-navbar scroll offset, scoped to this
  // page and reverted on unmount so other routes keep the default scroll behavior.
  // Honors reduced-motion (no smooth scroll).
  useEffect(() => {
    const html = document.documentElement
    const prevBehavior = html.style.scrollBehavior
    const prevPadding = html.style.scrollPaddingTop
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) html.style.scrollBehavior = 'smooth'
    html.style.scrollPaddingTop = '84px'
    return () => {
      html.style.scrollBehavior = prevBehavior
      html.style.scrollPaddingTop = prevPadding
    }
  }, [])

  return (
    <div className="bg-bg-soft text-text-primary flex min-h-screen flex-col overflow-x-clip">
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
