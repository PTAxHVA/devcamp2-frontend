import React from 'react'
import Roadmap from './RoadMapComponent/Roadmap'
import Logo from '/src/assets/Logo.svg'
import { RiAccountCircleLine } from 'react-icons/ri'
import { LuShieldCheck } from 'react-icons/lu'
import { BiLogoPostgresql } from 'react-icons/bi'
import { TbBrandAmongUs } from 'react-icons/tb'
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaPython,
  FaAngular,
  FaCode,
  FaRust,
} from 'react-icons/fa'
import {
  RiClipboardLine,
  RiMapPinLine,
  RiBookOpenLine,
  RiAwardLine,
  RiArrowRightLine,
  RiTeamLine,
  RiShieldCheckLine,
  RiRocketLine,
  RiCheckLine,
} from 'react-icons/ri'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* NAVBAR */}
      <header className="border-b border-base-200 bg-base-100 sticky top-0 z-50">
        <div className="navbar max-w-[1800px] mx-auto px-4 h-20">
          <div className="flex-1">
            <img src={Logo} alt="VORA Logo" className="w-48 h-auto object-contain" />
          </div>
          <div className="flex-none gap-2 sm:gap-4">
            <button className="btn btn-ghost font-semibold">Login</button>
            <button className="btn btn-primary font-semibold">Get Started</button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}

        <section className="max-w-450 mx-auto px-6 lg:px-16 py-16 lg:py-10">
          <div className="absolute inset-0 pointer-events-none z-0">
            <FaReact className="absolute top-[15%] left-[35%] text-[#61DAFB] w-12 h-12 opacity-50 animate-float hidden md:block" />
            <FaHtml5 className="absolute top-[40%] left-[45%] text-[#E34F26] w-16 h-16 opacity-20 animate-float-delayed" />
            <FaCss3Alt className="absolute bottom-20 left-[5%] text-[#1572B6] w-14 h-14 opacity-20 animate-float-slow hidden lg:block" />
            <FaNodeJs className="absolute bottom-[10%] left-[30%] text-[#339933] w-10 h-10 opacity-20 animate-float-delayed hidden md:block" />
            <FaPython className="absolute bottom-10 right-[40%] text-[#3776AB] w-12 h-12 opacity-20 animate-float hidden lg:block" />
            <FaCode className="absolute rotate-30 top-30 right-[80%] text-[#3776AB] w-12 h-12 opacity-15 animate-float hidden lg:block" />
            <FaAngular className="absolute rotate-2 bottom-[-10%] right-[80%] text-[#E34F26] w-12 h-12 opacity-15 animate-float hidden lg:block" />
            <BiLogoPostgresql className="absolute rotate-2 bottom-[-10%] left-[80%] text-blue-700 w-12 h-12 opacity-30 animate-float hidden lg:block" />
            <FaRust className="absolute rotate-2 bottom-[20%] left-[80%] text-blue-300 w-12 h-12 opacity-30 animate-float hidden lg:block" />
            <TbBrandAmongUs className="absolute rotate-2 bottom-[29%] right-[10%] text-red-400 w-12 h-12 opacity-30 animate-float hidden lg:block" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 w-full justify-between items-center">
            {/* Cột Trái */}
            <div className="w-full lg:w-1/2 space-y-9">
              <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
                Build your verified <br className="hidden lg:block" /> web development roadmap
              </h1>
              <p className="text-lg opacity-80 font-medium">
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
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2 sm:divide-x divide-base-300">
                  {[
                    {
                      icon: <RiAccountCircleLine className="w-8 h-8 text-primary" />,
                      title: 'Personalized for you',
                      desc: 'Tailored to your goals and experience',
                    },
                    {
                      icon: <LuShieldCheck className="w-8 h-8 text-primary" />,
                      title: 'Structured learning',
                      desc: 'Clear, logical step-by-step progression',
                    },
                    {
                      icon: <FaCode className="w-8 h-8 text-primary" />,
                      title: 'Practice with real projects',
                      desc: 'Build portfolio projects and apply your skills',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${index !== 0 && 'sm:pl-4'}`}
                    >
                      <div className="shrink-0 flex items-center justify-center mt-1">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-base font-bold leading-tight whitespace-nowrap">
                          {item.title}
                        </h4>
                        <p className="text-sm opacity-70 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-sm border border-base-300 bg-base-100 flex flex-col">
              <div className="h-16 border-b border-base-200 flex items-center justify-between px-6 bg-base-50 shrink-0">
                <div className="flex items-center gap-6">
                  {/* <div className="flex items-center gap-1.5 shrink-0 hidden sm:flex">
              <div className="w-3 h-3 rounded-full bg-base-300"></div>
              <div className="w-3 h-3 rounded-full bg-base-300"></div>
              <div className="w-3 h-3 rounded-full bg-base-300"></div>
            </div> */}

                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg hidden sm:block">Your Roadmap</h3>
                    <span className="badge badge-primary badge-outline badge-sm font-semibold px-3 py-2">
                      Frontend Developer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium opacity-80 hidden sm:flex">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center text-white">
                      <RiCheckLine className="w-3 h-3" />
                    </div>
                    <span>Done</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full border-[3px] border-purple-500 flex items-center justify-center bg-white">
                      <div className="w-2 h-2 bg-purple-900 rounded-full" />
                    </div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full border-2 border-base-300 bg-white" />
                    <span>Upcoming</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full relative bg-[#fafafa]">
                <Roadmap />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="bg-base-200 py-10 lg:py-15">
          <div className="max-w-[1600px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-2">How it works</h2>
            <p className="opacity-70 font-semibold mb-12">
              Get a personalized roadmap and start learning in four simple steps.
            </p>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 text-left">
              {[
                {
                  step: 1,
                  icon: <RiClipboardLine className="w-12 h-12 text-primary" />,
                  title: 'Answer questions',
                  desc: 'Tell us about your goals, experience, and preferences with a short quiz.',
                },
                {
                  step: 2,
                  icon: <RiMapPinLine className="w-12 h-12 text-primary" />,
                  title: 'Get your roadmap',
                  desc: 'Our AI builds a personalized roadmap tailored to you in seconds.',
                },
                {
                  step: 3,
                  icon: <RiBookOpenLine className="w-12 h-12 text-primary" />,
                  title: 'Learn section by section',
                  desc: 'Follow clear steps, resources, and projects at your own pace.',
                },
                {
                  step: 4,
                  icon: <RiAwardLine className="w-12 h-12 text-primary" />,
                  title: 'Pass quizzes to progress',
                  desc: "Test your knowledge, track your progress, and unlock what's next.",
                },
              ].map((item, index) => (
                <React.Fragment key={item.step}>
                  <div className="card bg-base-100 flex-1 border border-base-300 shadow-sm">
                    <div className="card-body gap-4 p-6 justify-center">
                      <div className="flex flex-col items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl">{item.icon}</div>
                        <div>
                          <h3 className="card-title text-lg mb-2">{item.title}</h3>
                          <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="hidden lg:flex shrink-0 items-center justify-center text-primary/40">
                      <RiArrowRightLine className="w-8 h-8" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-base-100 border-t border-base-200 mt-auto py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
            <div className="flex items-center gap-4">
              <div className="text-primary">
                <RiTeamLine className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-l font-bold leading-tight">Tailored for You</span>
                <span className="text-sm opacity-70">Your unique learning path</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-base-300"></div>

            <div className="flex items-center gap-4">
              <div className="text-primary">
                <RiShieldCheckLine className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-l font-bold leading-tight">Curated Resources</span>
                <span className="text-sm opacity-70">High-quality, modern tutorials</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-base-300"></div>

            <div className="flex items-center gap-4">
              <div className="text-primary">
                <RiRocketLine className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-l font-bold leading-tight">Project-Driven</span>
                <span className="text-sm opacity-70">Learn by building real apps</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
