import Logo from '@/assets/Logo.svg'
export const Navbar = () => {
  return (
    <header className="border-b border-base-200 bg-base-100 sticky top-0 z-50">
      <div className="navbar max-w-450 mx-auto px-4 h-20">
        <div className="flex-1">
          <img src={Logo} alt="VORA Logo" className="w-48 h-auto object-contain" />
        </div>
        <div className="flex-none gap-2 sm:gap-4">
          <button className="btn btn-ghost font-semibold">Login</button>
          <button className="btn btn-primary font-semibold">Get Started</button>
        </div>
      </div>
    </header>
  )
}
