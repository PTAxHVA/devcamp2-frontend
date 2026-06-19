import { RiAccountCircleLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri'
import { LuShieldCheck } from 'react-icons/lu'
import { FaCode } from 'react-icons/fa6'
import { Link } from 'react-router'
import Roadmap from '@/features/roadmap/components/roadmap'
import FloatingTechIcons from './floating-tech-icons'

export const HeroSection = () => {
  return (
    <section className="mx-auto max-w-450 px-6 py-16 lg:px-16 lg:py-10">
      <FloatingTechIcons />
      <div className="relative z-10 flex w-full flex-col items-center justify-between gap-12 lg:flex-row lg:gap-24">
        {/* Cột Trái */}
        <div className="w-full space-y-9 lg:w-1/2">
          <h1 className="text-text-primary text-3xl leading-tight font-extrabold lg:text-5xl">
            Build your verified <br className="hidden lg:block" /> web development roadmap
          </h1>
          <p className="text-text-secondary text-lg font-medium">
            VORA creates a personalized roadmap based on your goals,
            <br className="hidden lg:block" /> experience, and preferences. Learn step by step,
            practice with <br className="hidden lg:block" />
            real projects, and track your progress with confidence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/signup" className="btn btn-primary px-8">
              Get Started <RiArrowRightLine className="ml-1" />
            </Link>
            <Link to="/demo-roadmap" className="btn btn-outline px-8">
              <span>▶</span> View Demo Roadmap
            </Link>
          </div>

          <div className="pt-10">
            <div className="divide-border-soft grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-2 sm:divide-x">
              {[
                {
                  icon: <RiAccountCircleLine className="text-brand-purple-500 h-8 w-8" />,
                  title: 'Personalized for you',
                  desc: 'Tailored to your goals and experience',
                },
                {
                  icon: <LuShieldCheck className="text-brand-purple-500 h-8 w-8" />,
                  title: 'Structured learning',
                  desc: 'Clear, logical step-by-step progression',
                },
                {
                  icon: <FaCode className="text-brand-purple-500 h-8 w-8" />,
                  title: 'Practice with real projects',
                  desc: 'Build portfolio projects and apply your skills',
                },
              ].map((item, index) => (
                <div key={index} className={`flex items-start gap-3 ${index !== 0 && 'sm:pl-4'}`}>
                  <div className="mt-1 flex shrink-0 items-center justify-center">{item.icon}</div>
                  <div className="flex flex-col">
                    <h4 className="text-text-primary text-base leading-tight font-bold">
                      {item.title}
                    </h4>
                    <p className="text-text-muted mt-1 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Preview */}
        <div className="border-border-soft bg-bg-card flex h-125 w-full flex-col overflow-hidden rounded-xl border shadow-sm lg:h-150 lg:w-1/2">
          <div className="border-border-soft flex h-16 items-center justify-between gap-2 overflow-hidden border-b px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex min-w-0 shrink items-center gap-2">
                <h3 className="text-text-primary hidden text-lg font-bold whitespace-nowrap sm:block">
                  Your Roadmap
                </h3>
                <span className="badge badge-primary badge-outline badge-sm max-w-32 truncate px-2 py-1 font-semibold">
                  Frontend Developer
                </span>
              </div>
            </div>

            <div className="text-text-secondary flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium sm:text-sm">
              <div className="flex items-center gap-1.5">
                <div className="bg-brand-navy-900 flex h-5 w-5 items-center justify-center rounded-full text-white">
                  <RiCheckLine className="h-3 w-3" />
                </div>
                <span>Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="border-brand-purple-500 flex h-5 w-5 items-center justify-center rounded-full border-[3px] bg-white">
                  <div className="bg-brand-purple-700 h-2 w-2 rounded-full" />
                </div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="border-border-input h-5 w-5 rounded-full border-2 bg-white" />
                <span>Upcoming</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-soft relative w-full flex-1">
            <Roadmap />
          </div>
        </div>
      </div>
    </section>
  )
}
