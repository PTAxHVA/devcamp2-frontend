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
    <section className="bg-bg-section py-10 lg:py-15">
      <div className="mx-auto max-w-400 px-6 text-center">
        <h2 className="text-text-primary mb-2 text-3xl font-bold">How it works</h2>
        <p className="text-text-muted mb-12 font-semibold">
          Get a personalized roadmap and start learning in four simple steps.
        </p>

        <div className="flex flex-col items-stretch gap-6 text-left lg:flex-row lg:items-center">
          {[
            {
              step: 1,
              icon: <RiClipboardLine className="text-brand-purple-500 h-12 w-12" />,
              title: 'Answer questions',
              desc: 'Tell us about your goals, experience, and preferences with a short quiz.',
            },
            {
              step: 2,
              icon: <RiMapPinLine className="text-brand-purple-500 h-12 w-12" />,
              title: 'Get your roadmap',
              desc: 'Our AI builds a personalized roadmap tailored to you in seconds.',
            },
            {
              step: 3,
              icon: <RiBookOpenLine className="text-brand-purple-500 h-12 w-12" />,
              title: 'Learn section by section',
              desc: 'Follow clear steps, resources, and projects at your own pace.',
            },
            {
              step: 4,
              icon: <RiAwardLine className="text-brand-purple-500 h-12 w-12" />,
              title: 'Pass quizzes to progress',
              desc: "Test your knowledge, track your progress, and unlock what's next.",
            },
          ].map((item, index) => (
            <React.Fragment key={item.step}>
              <div className="card bg-bg-card border-border-soft flex-1 border shadow-sm">
                <div className="card-body justify-center gap-4 p-6">
                  <div className="flex flex-col items-start gap-4">
                    <div className="bg-brand-purple-500/10 rounded-xl p-2">{item.icon}</div>
                    <div>
                      <h3 className="card-title text-text-primary mb-2 text-lg">{item.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {index < 3 && (
                <div className="text-brand-purple-500/40 hidden shrink-0 items-center justify-center lg:flex">
                  <RiArrowRightLine className="h-8 w-8" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
