import {
  RiUserLine,
  RiLightbulbFlashLine,
  RiCodeSSlashLine,
  RiArrowRightLine,
} from 'react-icons/ri'

export const StepIntro = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-16 items-center animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <h1 className="text-5xl font-extrabold text-text-primary mb-4 leading-tight">
            Let's build your
            <br /> learning roadmap
          </h1>
          <p className="text-[20px] text-text-secondary">
            VORA creates a personalized web development roadmap based on your goals, experience, and
            preferences—so you learn the right skills in the right order.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              icon: RiUserLine,
              title: 'Personalized for your goals',
              desc: 'We tailor your roadmap to your target role, interests, and timeline.',
            },
            {
              icon: RiLightbulbFlashLine,
              title: 'Focused and efficient',
              desc: 'Learn only what matters. Skip the noise and build real-world skills faster.',
            },
            {
              icon: RiCodeSSlashLine,
              title: 'Industry-standard paths',
              desc: 'Follow tracks designed by experts to land your dream developer job.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 bg-brand-purple-50 text-brand-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-fit bg-[#0B1528] hover:bg-[#15233e] text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all active:scale-95 hover:shadow-lg"
        >
          Start personalization <RiArrowRightLine className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 w-full bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-6 text-center">Your personalized roadmap</h4>
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-10 border border-brand-purple-200 rounded flex items-center justify-center text-xs font-bold bg-brand-purple-50">
              Web Fundamentals
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex gap-4">
              <div className="w-28 h-10 border border-slate-200 rounded flex items-center justify-center text-xs font-bold">
                HTML & CSS
              </div>
              <div className="w-28 h-10 border border-brand-purple-600 text-brand-purple-700 rounded flex items-center justify-center text-xs font-bold ring-2 ring-brand-purple-100">
                JS Basics
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="w-32 h-10 border border-slate-200 rounded flex items-center justify-center text-xs font-bold">
              DOM & Events
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div> Completed
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border-2 border-brand-purple-600"></div> Current
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
