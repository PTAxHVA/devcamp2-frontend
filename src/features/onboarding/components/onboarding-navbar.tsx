import { RiQuestionLine, RiUser3Line } from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

export const NavBar = () => {
  return (
    <header className="flex items-center justify-between px-8 py-6 lg:px-12">
      <div className="text-text-primary text-2xl font-bold tracking-tight">
        <img src={Logo} alt="VORA Logo" className="h-auto w-35 object-contain" />
      </div>
      <div className="text-text-muted flex items-center gap-4">
        <button className="border-border-soft hover:bg-bg-section flex h-10 w-10 items-center justify-center rounded-full border transition">
          <RiQuestionLine className="h-5 w-5" />
        </button>
        <button className="bg-bg-lavender text-brand-purple-700 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-purple-200">
          <RiUser3Line className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
