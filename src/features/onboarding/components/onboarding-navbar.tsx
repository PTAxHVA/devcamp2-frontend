import { RiQuestionLine, RiUser3Line } from 'react-icons/ri'
import Logo from '@/assets/Logo.svg'

export const NavBar = () => {
  return (
    <header className="px-8 lg:px-12 py-6 flex items-center justify-between">
      <div className="text-2xl font-bold tracking-tight text-slate-900">
        <img src={Logo} alt="VORA Logo" className="w-35 h-auto object-contain" />
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
          <RiQuestionLine className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center hover:bg-purple-200 transition">
          <RiUser3Line className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
