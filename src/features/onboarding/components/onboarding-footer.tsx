import { RiSunLine } from 'react-icons/ri'
export const Footer = () => {
  return (
    <footer className="border-border-soft text-text-placeholder mt-8 flex flex-col items-center justify-between border-t px-8 py-8 text-sm sm:flex-row lg:px-12">
      <p>© 2025 VORA. All rights reserved.</p>
      <div className="mt-4 flex items-center gap-8 sm:mt-0">
        <a href="#" className="hover:text-text-secondary transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-text-secondary transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-text-secondary transition-colors">
          Help
        </a>
        <button className="hover:text-text-secondary transition-colors">
          <RiSunLine className="h-5 w-5" />
        </button>
      </div>
    </footer>
  )
}
