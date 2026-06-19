import Logo from '@/assets/Logo.svg'
import { FiUser, FiTarget, FiCode, FiArrowRight } from 'react-icons/fi'

const features = [
  {
    icon: <FiUser className="text-indigo-600 text-xl" />,
    title: 'Personalized for your goals',
    desc: 'We tailor your roadmap to your target role, interests, and timeline.',
  },
  {
    icon: <FiTarget className="text-indigo-600 text-xl" />,
    title: 'Focused and efficient',
    desc: 'Learn only what matters. Skip the noise and build real-world skills faster',
  },
  {
    icon: <FiCode className="text-indigo-600 text-xl" />,
    title: 'Personalized for your goals',
    desc: 'We tailor your roadmap to your target role, interests, and timeline.',
  },
]

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-base-200 bg-base-100 sticky top-0 z-50">
        <div className="navbar max-w-screen-xl mx-auto px-4 h-20">
          <div className="flex-1">
            <img src={Logo} alt="VORA Logo" className="w-48 h-auto object-contain" />
          </div>
          <div className="flex-none gap-2 sm:gap-4">
            <button className="btn btn-ghost font-semibold">Login</button>
            <button className="btn btn-primary font-semibold">Get Started</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-10 px-8 py-10 max-w-6xl mx-auto w-full">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Let's build your
            <br />
            learning roadmap
          </h1>
          <p className="text-gray-500 text-sm mb-8 max-w-sm">
            VORA creates a personalized web development roadmap based on your goals, experience, and
            preferences—so you learn the right skills in the right order.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn bg-indigo-700 hover:bg-indigo-800 text-white border-none rounded-xl px-6 py-3 flex items-center gap-2 w-full justify-center text-sm font-semibold shadow-md">
            Start personalization <FiArrowRight />
          </button>

          <button className="mt-4 text-xs text-indigo-500 hover:underline text-left">
            ← Back to dashboard
          </button>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10 pt-6 border-t border-gray-100">
            <div>
              <div className="font-bold text-gray-800 text-sm">50K+</div>
              <div className="text-xs text-gray-400">Learners worldwide</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="font-bold text-gray-800 text-sm">Expert verified</div>
              <div className="text-xs text-gray-400">Curriculum you can trust</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <div className="font-bold text-gray-800 text-sm">Real results</div>
              <div className="text-xs text-gray-400">Build skills and ship project</div>
            </div>
          </div>
        </div>

        {/* Right - Roadmap Image */}
        <div className="flex-1 max-w-md w-full flex items-center justify-center">
          <div className="border border-gray-200 rounded-2xl bg-white shadow-sm p-5 w-full">
            <div className="text-center mb-3">
              <div className="font-semibold text-gray-800 text-sm">Your personalized roadmap</div>
              <div className="text-xs text-gray-400">A structured path built just for you.</div>
            </div>
            <img
              src="/roadmap-preview.png"
              alt="Personalized learning roadmap"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
