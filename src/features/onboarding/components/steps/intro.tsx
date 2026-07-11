import {
  RiUserLine,
  RiLightbulbFlashLine,
  RiCodeSSlashLine,
  RiArrowRightLine,
} from 'react-icons/ri'

export const StepIntro = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="animate-in fade-in flex w-full flex-col items-center gap-10 duration-700 lg:flex-row lg:gap-16">
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <h1 className="text-text-primary mb-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
            Let's build your
            <br /> learning roadmap
          </h1>
          <p className="text-text-secondary text-base sm:text-lg lg:text-[20px]">
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
              className="border-border-soft hover:bg-bg-card flex gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm"
            >
              <div className="bg-bg-lavender text-brand-purple-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-text-primary font-bold">{item.title}</h3>
                <p className="text-text-muted text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="focus-visible:ring-brand-purple-300 flex w-fit items-center gap-3 rounded-xl bg-[#0B1528] px-10 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-[#15233e] hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none active:scale-95"
        >
          Start personalization <RiArrowRightLine className="h-5 w-5" />
        </button>
      </div>

      <div className="border-border-soft bg-bg-section w-full flex-1 rounded-3xl border p-8 shadow-inner">
        <div className="border-border-soft bg-bg-card rounded-2xl border p-6 shadow-sm">
          <h4 className="text-text-primary mb-6 text-center font-bold">
            Your personalized roadmap
          </h4>
          <div className="flex flex-col items-center gap-4">
            <div className="border-brand-purple-200 bg-bg-lavender flex h-10 w-32 items-center justify-center rounded border text-xs font-bold">
              Web Fundamentals
            </div>
            <div className="bg-border-soft h-8 w-px"></div>
            <div className="flex gap-4">
              <div className="border-border-soft flex h-10 w-28 items-center justify-center rounded border text-xs font-bold">
                HTML & CSS
              </div>
              <div className="border-brand-purple-600 text-brand-purple-700 ring-brand-purple-100 flex h-10 w-28 items-center justify-center rounded border text-xs font-bold ring-2">
                JS Basics
              </div>
            </div>
            <div className="bg-border-soft h-8 w-px"></div>
            <div className="border-border-soft flex h-10 w-32 items-center justify-center rounded border text-xs font-bold">
              DOM & Events
            </div>
          </div>
          <div className="text-text-muted mt-8 flex justify-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div> Completed
            </span>
            <span className="flex items-center gap-1">
              <div className="border-brand-purple-600 h-3 w-3 rounded-full border-2"></div> Current
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
