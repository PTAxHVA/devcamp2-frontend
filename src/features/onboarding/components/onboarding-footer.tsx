import { RiSunLine } from 'react-icons/ri'
export const Footer = () => {
  return (
    <footer className="px-8 lg:px-12 py-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 border-t border-slate-100">
      <p>© 2025 VORA. All rights reserved.</p>
      <div className="flex items-center gap-8 mt-4 sm:mt-0">
        <a href="#" className="hover:text-slate-600 transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Help
        </a>
        <button className="hover:text-slate-600 transition-colors">
          <RiSunLine className="w-5 h-5" />
        </button>
      </div>
    </footer>
  )
}
