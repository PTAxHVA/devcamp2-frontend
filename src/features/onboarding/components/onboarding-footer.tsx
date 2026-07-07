import { Link } from 'react-router'

export const Footer = () => {
  return (
    <footer className="border-border-soft text-text-placeholder mt-8 flex flex-col items-center justify-between border-t px-8 py-8 text-sm sm:flex-row lg:px-12">
      <p>© {new Date().getFullYear()} VORA. All rights reserved.</p>
      <div className="mt-4 flex items-center gap-8 sm:mt-0">
        <Link
          to="/privacy"
          className="hover:text-text-secondary focus-visible:ring-brand-purple-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Privacy
        </Link>
        <Link
          to="/terms"
          className="hover:text-text-secondary focus-visible:ring-brand-purple-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Terms
        </Link>
      </div>
    </footer>
  )
}
