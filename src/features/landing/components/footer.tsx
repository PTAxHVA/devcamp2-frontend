import { RiTeamLine, RiShieldCheckLine, RiRocketLine } from 'react-icons/ri'

export const Footer = () => {
  return (
    <footer className="bg-bg-card border-border-soft mt-auto border-t py-6">
      <div className="mx-auto flex max-w-300 justify-center px-6">
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiTeamLine className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-bold">Tailored for You</span>
              <span className="text-text-muted text-sm">Your unique learning path</span>
            </div>
          </div>

          <div className="bg-border-input hidden h-10 w-px md:block"></div>

          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiShieldCheckLine className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-bold">Curated Resources</span>
              <span className="text-text-muted text-sm">High-quality, modern tutorials</span>
            </div>
          </div>

          <div className="bg-border-input hidden h-10 w-px md:block"></div>

          <div className="flex items-center gap-4">
            <div className="text-brand-purple-500">
              <RiRocketLine className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-bold">Project-Driven</span>
              <span className="text-text-muted text-sm">Learn by building real apps</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
