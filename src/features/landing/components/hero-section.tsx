import { RiAccountCircleLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri'
import { LuShieldCheck } from 'react-icons/lu'
import { FaCode } from 'react-icons/fa6'
import Roadmap from '@/features/roadmap/components/roadmap'
import FloatingTechIcons from './floating-tech-icons'

export const HeroSection = () => {
  return (
    <section className="max-w-450 mx-auto px-6 lg:px-16 py-16 lg:py-10">
      <FloatingTechIcons />
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 w-full justify-between items-center">
        {/* Cột Trái */}
        <div className="w-full lg:w-1/2 space-y-9">
          <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight text-text-primary">
            Build your verified <br className="hidden lg:block" /> web development roadmap
          </h1>
          <p className="text-lg text-text-secondary font-medium">
            VORA creates a personalized roadmap based on your goals,
            <br className="hidden lg:block" /> experience, and preferences. Learn step by step,
            practice with <br className="hidden lg:block" />
            real projects, and track your progress with confidence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="btn btn-primary px-8">
              Get Started <RiArrowRightLine className="ml-1" />
            </button>
            <button className="btn btn-outline px-8">
              <span>▶</span> View Demo Roadmap
            </button>
          </div>

          <div className="pt-10">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2 sm:divide-x divide-border-soft">
              {[
                {
                  icon: <RiAccountCircleLine className="w-8 h-8 text-brand-purple-500" />,
                  title: 'Personalized for you',
                  desc: 'Tailored to your goals and experience',
                },
                {
                  icon: <LuShieldCheck className="w-8 h-8 text-brand-purple-500" />,
                  title: 'Structured learning',
                  desc: 'Clear, logical step-by-step progression',
                },
                {
                  icon: <FaCode className="w-8 h-8 text-brand-purple-500" />,
                  title: 'Practice with real projects',
                  desc: 'Build portfolio projects and apply your skills',
                },
              ].map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${index !== 0 && 'sm:pl-4'}`}>
                  <div className="shrink-0 flex items-center justify-center mt-1">{item.icon}</div>
                  <div className="flex flex-col">
                    <h4 className="text-base font-bold leading-tight text-text-primary">
                      {item.title}
                    </h4>
                    <p className="text-sm text-text-muted mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Preview */}
        <div className="w-full lg:w-1/2 h-125 lg:h-150 rounded-xl overflow-hidden shadow-sm border border-border-soft bg-bg-card flex flex-col">
          <div className="h-16 border-b border-border-soft flex items-center justify-between px-4 sm:px-6 gap-2 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0 shrink">
                <h3 className="font-bold text-lg hidden sm:block text-text-primary whitespace-nowrap">
                  Your Roadmap
                </h3>
                <span className="badge badge-primary badge-outline badge-sm font-semibold px-2 py-1 truncate max-w-32">
                  Frontend Developer
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-text-secondary shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-brand-navy-900 flex items-center justify-center text-white">
                  <RiCheckLine className="w-3 h-3" />
                </div>
                <span>Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border-[3px] border-brand-purple-500 flex items-center justify-center bg-white">
                  <div className="w-2 h-2 bg-brand-purple-700 rounded-full" />
                </div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border-2 border-border-input bg-white" />
                <span>Upcoming</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative bg-bg-soft">
            <Roadmap />
          </div>
        </div>
      </div>
    </section>
  )
}
