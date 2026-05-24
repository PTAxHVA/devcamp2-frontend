import { NavBar, MainContent, Footer } from './components'
const MainBoarding = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <NavBar />
      <MainContent />
      <Footer />
    </div>
  )
}
export default MainBoarding
