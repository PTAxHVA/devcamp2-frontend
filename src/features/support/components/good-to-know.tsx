import { Link } from 'react-router'
import type { IconType } from 'react-icons'
import { RiTimeLine, RiFlashlightLine, RiRefreshLine, RiArrowRightLine } from 'react-icons/ri'

const TIPS: { Icon: IconType; text: string }[] = [
  {
    Icon: RiTimeLine,
    text: 'The first load after a while can take a few moments while the server wakes up — then it is fast.',
  },
  {
    Icon: RiFlashlightLine,
    text: 'If a feature says "AI is busy", that is it degrading gracefully — your roadmaps, quizzes and progress keep working.',
  },
  {
    Icon: RiRefreshLine,
    text: 'Failed a quiz? Wait about a minute, then retry — your answers are reviewed so you know what to fix.',
  },
]

/** Reassurance callout (replaces a contact form): grounded, known behaviours. */
export const GoodToKnow = () => (
  <section className="border-brand-purple-300 from-bg-lavender rounded-3xl border bg-gradient-to-br to-white p-7">
    <h2 className="text-brand-navy-900 text-lg font-extrabold">Good to know</h2>
    <p className="text-text-muted mt-1 text-sm">A few things that help your session go smoothly.</p>

    <ul className="mt-4 flex flex-col gap-3">
      {TIPS.map(({ Icon, text }) => (
        <li
          key={text}
          className="text-text-secondary flex items-start gap-3 text-sm leading-relaxed"
        >
          <span className="border-brand-purple-300 text-brand-purple-500 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white">
            <Icon className="h-[15px] w-[15px]" />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>

    <Link
      to="/dashboard"
      className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      Back to dashboard
      <RiArrowRightLine className="h-4 w-4" />
    </Link>
  </section>
)
