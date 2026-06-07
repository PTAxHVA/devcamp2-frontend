import { RiSearchLine, RiNotification3Line } from 'react-icons/ri'
// import Logo from '@/assets/Logo.svg'

export const Navbar = () => {
  return (
    <header className="h-20 border-b border-slate-200 bg-white flex-row flex items-center justify-between px-8 shrink-0 z-10">
      {/* <div>
            <img src={Logo} alt="VORA Logo" className="w-35 h-auto object-contain" />
        </div> */}
      <div className="flex-1 max-w-2xl relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search topics, skills, roadmaps..."
          className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded border border-slate-200 bg-white text-xs text-slate-400 font-medium">
          /
        </span>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <RiNotification3Line className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <span className="font-semibold text-sm">Alex D.</span>
        </div>
      </div>
    </header>
  )
}
