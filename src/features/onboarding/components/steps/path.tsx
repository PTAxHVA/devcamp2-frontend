import { useWizardStore } from '../../onboarding-store'
import { RECOMMEND_CHOICE_VALUE } from '../../data/onboarding-data'
import { LuCode, LuSparkles } from 'react-icons/lu'
import {
  RiReactjsLine,
  RiAngularjsLine,
  RiBootstrapLine,
  RiLayout4Line,
  RiProfileLine,
  RiDashboardLine,
  RiShoppingCartLine,
} from 'react-icons/ri'

// A "let VORA choose" card offered on each fork step. Selecting it stores the
// RECOMMEND_CHOICE_VALUE sentinel, which the branch resolver reads as "no
// preference" and falls back to that group's recommended default branch.
const recommendOption = {
  id: RECOMMEND_CHOICE_VALUE,
  title: 'Not sure yet',
  desc: "We'll recommend a beginner-friendly path for you.",
  icon: <LuSparkles className="text-brand-purple-600 h-10 w-10" />,
}

export const StepLearningPath = () => {
  const { answers, setAnswer } = useWizardStore()

  const selectedFramework = answers?.learningFramework as string | undefined
  const selectedStyling = answers?.styling as string | undefined
  const selectedProject = answers?.projectDirection as string | undefined

  const sections = [
    {
      id: 1,
      title: 'Choose your framework',
      subtitle: 'Select your framework you want to focus',
      state: selectedFramework,
      setState: (val: string) => setAnswer('learningFramework', val),
      options: [
        {
          id: 'react',
          title: 'React',
          desc: 'A popular library for building user interfaces.',
          icon: <RiReactjsLine className="h-10 w-10 text-[#61DAFB]" />,
        },
        {
          id: 'vue',
          title: 'Vue',
          desc: 'A progressive framework for building modern web apps.',
          icon: <LuCode className="h-10 w-10 text-[#41B883]" />,
        },
        {
          id: 'angular',
          title: 'Angular',
          desc: 'A full-featured framework for scalable applications.',
          icon: <RiAngularjsLine className="h-10 w-10 text-[#DD0031]" />,
        },
        recommendOption,
      ],
    },
    {
      id: 2,
      title: 'Choose your styling preferences',
      subtitle: 'Pick your preferred way to style your components and layouts',
      state: selectedStyling,
      setState: (val: string) => setAnswer('styling', val),
      options: [
        {
          id: 'tailwind',
          title: 'Tailwind CSS',
          desc: 'A utility-first framework for rapid UI development.',
          icon: <RiLayout4Line className="h-10 w-10 text-[#38bdf8]" />,
        },
        {
          id: 'bootstrap',
          title: 'Bootstrap',
          desc: 'A component-rich framework for fast, responsive UIs.',
          icon: <RiBootstrapLine className="h-10 w-10 text-[#7952B3]" />,
        },
        recommendOption,
      ],
    },
    {
      id: 3,
      title: 'Choose your project direction',
      subtitle: 'Pick the type of projects you want to build along way.',
      state: selectedProject,
      setState: (val: string) => setAnswer('projectDirection', val),
      options: [
        {
          id: 'portfolio',
          title: 'Portfolio',
          desc: 'Build a personal website to showcase your work.',
          icon: <RiProfileLine className="text-text-secondary h-10 w-10" />,
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          desc: 'Create interactive interfaces for data visualization.',
          icon: <RiDashboardLine className="text-text-secondary h-10 w-10" />,
        },
        {
          id: 'ecommerce',
          title: 'E-commerce',
          desc: 'Develop modern online shopping experiences.',
          icon: <RiShoppingCartLine className="text-text-secondary h-10 w-10" />,
        },
      ],
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-12 text-left">
        <h1 className="text-text-primary mb-3 text-4xl font-bold">Choose your learning path</h1>
        <p className="text-text-secondary max-w-2xl text-lg font-medium">
          Tell us your preferences so we can tailor your roadmap to match your goals.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.id}>
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-bg-lavender text-brand-purple-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                {section.id}
              </div>
              <div>
                <h2 className="text-text-primary text-xl font-bold">{section.title}</h2>
                <p className="text-text-muted text-sm">{section.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:pl-14 lg:grid-cols-3">
              {section.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => section.setState(option.id)}
                  className={`bg-bg-card relative flex min-h-30 cursor-pointer items-center gap-4 rounded-2xl p-6 transition-all duration-200 ${
                    section.state === option.id
                      ? 'border-brand-purple-300 bg-bg-lavender/10 ring-brand-purple-300 -translate-y-1 border-2 shadow-[0_8px_30px_-4px_rgba(109,40,217,0.1)] ring-2'
                      : 'border-border-soft hover:border-border-input border shadow-sm hover:-translate-y-1 hover:shadow-md'
                  } `}
                >
                  <div className="absolute top-4 right-4 flex items-center justify-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${section.state === option.id ? 'border-brand-purple-600' : 'border-border-input'}`}
                    >
                      {section.state === option.id && (
                        <div className="bg-brand-purple-600 h-2.5 w-2.5 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">{option.icon}</div>
                  <div className="flex-1 pr-4">
                    <h3 className="text-text-primary mb-1 text-lg leading-tight font-bold">
                      {option.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed">{option.desc}</p>
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
