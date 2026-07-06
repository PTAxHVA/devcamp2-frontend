import Logo from '@/assets/Logo.svg'
import { FiUser, FiTarget, FiCode, FiArrowRight } from 'react-icons/fi'

const features = [
  {
    icon: <FiUser className="text-xl text-indigo-600" />,
    title: 'Personalized for your goals',
    desc: 'We tailor your roadmap to your target role, interests, and timeline.',
  },
  {
    icon: <FiTarget className="text-xl text-indigo-600" />,
    title: 'Focused and efficient',
    desc: 'Learn only what matters. Skip the noise and build real-world skills faster',
  },
  {
    icon: <FiCode className="text-xl text-indigo-600" />,
    title: 'Personalized for your goals',
    desc: 'We tailor your roadmap to your target role, interests, and timeline.',
  },
]

export default function OnboardingLayout() {
  return (
    <div className="bg-bg-card flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-base-200 bg-base-100 sticky top-0 z-50 border-b">
        <div className="navbar mx-auto h-20 max-w-screen-xl px-4">
          <div className="flex-1">
            <img src={Logo} alt="VORA Logo" className="h-auto w-48 object-contain" />
          </div>
          <div className="flex-none gap-2 sm:gap-4">
            <button className="btn btn-ghost font-semibold">Login</button>
            <button className="btn btn-primary font-semibold">Get Started</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-8 py-10 lg:flex-row">
        {/* Left */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-text-primary mb-4 text-4xl leading-tight font-extrabold">
            Let's build your
            <br />
            learning roadmap
          </h1>
          <p className="text-text-muted mb-8 max-w-sm text-sm">
            VORA creates a personalized web development roadmap based on your goals, experience, and
            preferences—so you learn the right skills in the right order.
          </p>

          <div className="mb-8 flex flex-col gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-bg-section border-border-soft flex items-start gap-4 rounded-xl border p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                  {f.icon}
                </div>
                <div>
                  <div className="text-text-primary text-sm font-semibold">{f.title}</div>
                  <div className="text-text-placeholder mt-0.5 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn flex w-full items-center justify-center gap-2 rounded-xl border-none bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-800">
            Start personalization <FiArrowRight />
          </button>

          <button className="mt-4 text-left text-xs text-indigo-500 hover:underline">
            ← Back to dashboard
          </button>

          {/* Stats */}
          <div className="border-border-soft mt-10 flex items-center gap-8 border-t pt-6">
            <div>
              <div className="text-text-primary text-sm font-bold">50K+</div>
              <div className="text-text-placeholder text-xs">Learners worldwide</div>
            </div>
            <div className="bg-border-soft h-8 w-px" />
            <div>
              <div className="text-text-primary text-sm font-bold">Expert verified</div>
              <div className="text-text-placeholder text-xs">Curriculum you can trust</div>
            </div>
            <div className="bg-border-soft h-8 w-px" />
            <div>
              <div className="text-text-primary text-sm font-bold">Real results</div>
              <div className="text-text-placeholder text-xs">Build skills and ship project</div>
            </div>
          </div>
        </div>

        {/* Right - Roadmap Image */}
        <div className="flex w-full max-w-md flex-1 items-center justify-center">
          <div className="border-border-soft bg-bg-card w-full rounded-2xl border p-5 shadow-sm">
            <div className="mb-3 text-center">
              <div className="text-text-primary text-sm font-semibold">
                Your personalized roadmap
              </div>
              <div className="text-text-placeholder text-xs">
                A structured path built just for you.
              </div>
            </div>
            <img
              src="/roadmap-preview.png"
              alt="Personalized learning roadmap"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
