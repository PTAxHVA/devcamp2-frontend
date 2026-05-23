import { Navbar, HeroSection, HowItWorks, Footer } from '@/features/landing/components'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
