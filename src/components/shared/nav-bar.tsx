import { RiSearchLine, RiNotification3Line } from 'react-icons/ri'

export const Navbar = () => {
  return (
    <header className="z-10 flex h-20 shrink-0 flex-row items-center justify-between border-b border-slate-200 bg-white px-4 pl-14 md:px-8 md:pl-8">
      <div className="relative max-w-2xl flex-1">
        <RiSearchLine className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search topics, skills, roadmaps..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-12 pl-11 text-sm transition-colors focus:border-purple-400 focus:bg-white focus:outline-none"
        />
        <span className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-400 md:block">
          /
        </span>
      </div>

      <div className="ml-4 flex items-center gap-4 md:ml-8 md:gap-6">
        <button className="relative text-slate-400 hover:text-slate-600">
          <RiNotification3Line className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>
        <div className="flex cursor-pointer items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
            AD
          </div>
          <span className="hidden text-sm font-semibold md:block">Alex D.</span>
        </div>
      </div>
    </header>
  )
}
