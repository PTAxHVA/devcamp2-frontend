import { useState } from 'react'
import { LuCode } from 'react-icons/lu'
import {
  RiReactjsLine,
  RiAngularjsLine,
  RiCss3Line,
  RiLayout4Line,
  RiFileCodeLine,
  RiProfileLine,
  RiDashboardLine,
  RiShoppingCartLine,
} from 'react-icons/ri'

export const StepLearningPath = () => {
  const [selectedFramework, setSelectedFramework] = useState('react')
  const [selectedStyling, setSelectedStyling] = useState('tailwind')
  const [selectedProject, setSelectedProject] = useState('portfolio')

  const sections = [
    {
      id: 1,
      title: 'Choose your framework',
      subtitle: 'Select your framework you want to focus',
      state: selectedFramework,
      setState: setSelectedFramework,
      options: [
        {
          id: 'react',
          title: 'React',
          desc: 'A popular library for building user interfaces.',
          icon: <RiReactjsLine className="w-10 h-10 text-[#61DAFB]" />,
        },
        {
          id: 'vue',
          title: 'Vue',
          desc: 'A progressive framework for building modern web apps.',
          icon: <LuCode className="w-10 h-10 text-[#41B883]" />,
        }, // Thay thế icon tùy ý
        {
          id: 'angular',
          title: 'Angular',
          desc: 'A full-featured framework for scalable applications.',
          icon: <RiAngularjsLine className="w-10 h-10 text-[#DD0031]" />,
        },
      ],
    },
    {
      id: 2,
      title: 'Choose your styling preferences',
      subtitle: 'Pick your preferred way to style your components and layouts',
      state: selectedStyling,
      setState: setSelectedStyling,
      options: [
        {
          id: 'css',
          title: 'CSS Fundamentals',
          desc: 'Core styling techniques for building web layouts.',
          icon: <RiCss3Line className="w-10 h-10 text-[#264de4]" />,
        },
        {
          id: 'tailwind',
          title: 'Tailwind CSS',
          desc: 'A utility-first framework for rapid UI development.',
          icon: <RiLayout4Line className="w-10 h-10 text-[#38bdf8]" />,
        },
        {
          id: 'scss',
          title: 'SCSS/ Sass',
          desc: 'Advanced CSS with variables and reusable styles.',
          icon: <RiFileCodeLine className="w-10 h-10 text-[#c6538c]" />,
        },
      ],
    },
    {
      id: 3,
      title: 'Choose your project direction',
      subtitle: 'Pick the type of projects you want to build along way.',
      state: selectedProject,
      setState: setSelectedProject,
      options: [
        {
          id: 'portfolio',
          title: 'Portfolio',
          desc: 'Build a personal website to showcase your work.',
          icon: <RiProfileLine className="w-10 h-10 text-slate-700" />,
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          desc: 'Create interactive interfaces for data visualization.',
          icon: <RiDashboardLine className="w-10 h-10 text-slate-700" />,
        },
        {
          id: 'ecommerce',
          title: 'E-commerce',
          desc: 'Develop modern online shopping experiences.',
          icon: <RiShoppingCartLine className="w-10 h-10 text-slate-700" />,
        },
      ],
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-12 text-left">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose your learning path</h1>
        <p className="text-lg text-slate-600 font-medium max-w-2xl">
          Tell us your preferences so we can create a personalized frontend roadmap that matches
          your goals with internet
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-purple-50 text-brand-purple-600 text-lg font-bold flex items-center justify-center shrink-0">
                {section.id}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                <p className="text-slate-500 text-sm">{section.subtitle}</p>
              </div>
            </div>

            {/* Đã xóa max-w để dãn rộng ra 2 bên theo ý bạn */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:pl-14">
              {section.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => section.setState(option.id)}
                  className={`relative cursor-pointer rounded-2xl p-6 bg-white transition-all duration-300 flex items-center gap-4 min-h-30
                    ${
                      section.state === option.id
                        ? 'border-2 border-brand-purple-300 bg-brand-purple-50/10 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2 ring-brand-purple-300 -translate-y-1'
                        : 'border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1'
                    }
                  `}
                >
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${section.state === option.id ? 'border-brand-purple-600' : 'border-slate-300'}`}
                    >
                      {section.state === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-purple-600"></div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">{option.icon}</div>
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                      {option.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{option.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
