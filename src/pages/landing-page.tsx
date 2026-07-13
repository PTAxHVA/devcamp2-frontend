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
