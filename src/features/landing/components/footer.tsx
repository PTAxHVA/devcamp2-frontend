import { RiTeamLine, RiShieldCheckLine, RiRocketLine } from 'react-icons/ri'

export const Footer = () => {
  return (
    <footer className="bg-bg-white border-t border-border-soft mt-auto py-6">
      <div className="max-w-300 mx-auto px-6 flex justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiTeamLine className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-l font-bold leading-tight">Tailored for You</span>
              <span className="text-sm text-text-muted">Your unique learning path</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-border-input"></div>

          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiShieldCheckLine className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-l font-bold leading-tight">Curated Resources</span>
              <span className="text-sm text-text-muted">High-quality, modern tutorials</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-border-input"></div>

          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiRocketLine className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-l font-bold leading-tight">Project-Driven</span>
              <span className="text-sm text-text-muted">Learn by building real apps</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
