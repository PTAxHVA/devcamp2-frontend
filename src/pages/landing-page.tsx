import { Navbar, HeroSection, HowItWorks, Footer } from '@/features/landing/components'

const LandingPage = () => {
  return (
    <div className="bg-base-100 text-base-content flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        {/* "How it works" + the flex-grow slack share the section background, so on
            tall (2K/4K) screens the footer stays pinned to the bottom without a bare
            white void opening up between the content and the footer. */}
        <div className="bg-bg-section flex flex-1 flex-col">
          <HowItWorks />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
