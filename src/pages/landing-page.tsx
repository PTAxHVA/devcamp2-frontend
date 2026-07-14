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
// Import Component Stickers
import { FloatingStickers } from '@/features/landing/components/floating-sticker.tsx'

const LandingPage = () => {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = reduced ? 'auto' : 'smooth'
    return () => {
      html.style.scrollBehavior = prev
    }
  }, [reduced])

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
      {/* 
        FloatingStickers lúc này đã mang z-40 (trong code của nó) 
        => Sẽ lơ lửng đè lên cả các khối trắng của StatsSection bên dưới 
      */}
      <FloatingStickers reducedMotion={reduced} />

      {/* Đảm bảo Navbar có z-50 để luôn là layer cao nhất, đè lên cả Sticker */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Thẻ main giữ relative mặc định, không cần z-10 nữa để nhường ưu tiên cho Sticker */}
      <main className="relative">
        <HeroSection />
        <StatsSection />
        <WhyVoraSection />
        <HowItWorksSection />
        <SignatureFeaturesSection />
        <FaqSection />
        <CtaBand />
      </main>

      {/* Bọc Footer bằng thẻ div thay vì chèn className trực tiếp để tránh lỗi TypeScript */}
      <div className="relative">
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
