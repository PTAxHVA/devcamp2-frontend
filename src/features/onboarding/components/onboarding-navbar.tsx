import { RiQuestionLine, RiUser3Line } from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

export const NavBar = () => {
  return (
    <header className="flex items-center justify-between px-8 py-6 lg:px-12">
      <div className="text-2xl font-bold tracking-tight text-slate-900">
        <img src={Logo} alt="VORA Logo" className="h-auto w-35 object-contain" />
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50">
          <RiQuestionLine className="h-5 w-5" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 transition hover:bg-purple-200">
          <RiUser3Line className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
