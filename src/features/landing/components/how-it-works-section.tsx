import React from 'react'
import {
  RiClipboardLine,
  RiMapPinLine,
  RiBookOpenLine,
  RiAwardLine,
  RiArrowRightLine,
} from 'react-icons/ri'

export const HowItWorks = () => {
  return (
    <section className="bg-base-200 py-10 lg:py-15">
      <div className="max-w-400 mx-auto px-6 text-center">
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
  )
}
