import { RiSunLine } from 'react-icons/ri'
export const Footer = () => {
  return (
    <footer className="mt-8 flex flex-col items-center justify-between border-t border-slate-100 px-8 py-8 text-sm text-slate-400 sm:flex-row lg:px-12">
      <p>© 2025 VORA. All rights reserved.</p>
      <div className="mt-4 flex items-center gap-8 sm:mt-0">
        <a href="#" className="transition-colors hover:text-slate-600">
          Privacy
        </a>
        <a href="#" className="transition-colors hover:text-slate-600">
          Terms
        </a>
        <a href="#" className="transition-colors hover:text-slate-600">
          Help
        </a>
        <button className="transition-colors hover:text-slate-600">
          <RiSunLine className="h-5 w-5" />
        </button>
      </div>
    </footer>
  )
}
