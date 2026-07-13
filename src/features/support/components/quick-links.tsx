import { Link } from 'react-router'
import { RiArrowRightLine } from 'react-icons/ri'
import { QUICK_LINKS } from '../support-content'

/**
 * "Jump back in" — cards linking to the real flows. Laid out with flex-wrap +
 * justify-center so the trailing short row (2 of 5) stays centered under the row
 * of 3 instead of hanging left.
 */
export const QuickLinks = () => (
  <section aria-labelledby="quick-links-heading">
    <p className="text-brand-purple-600 text-xs font-bold tracking-[0.12em] uppercase">
      Quick links
    </p>
    <h2 id="quick-links-heading" className="text-text-primary mt-1 text-xl font-extrabold">
      Jump back in
    </h2>

    <div className="mt-4 flex flex-wrap justify-center gap-4">
      {QUICK_LINKS.map(({ to, title, description, Icon }) => (
        <Link
          key={to}
          to={to}
          className="group border-border-soft focus-visible:ring-brand-purple-300 hover:border-brand-purple-400 relative flex grow-0 basis-full flex-col gap-2.5 rounded-3xl border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-purple-700/25 focus-visible:ring-2 focus-visible:outline-none sm:basis-[calc((100%_-_1rem)/2)] lg:basis-[calc((100%_-_2rem)/3)]"
        >
          <span className="bg-bg-lavender text-brand-purple-500 flex h-11 w-11 items-center justify-center rounded-2xl">
            <Icon className="h-[22px] w-[22px]" />
          </span>
          <h3 className="text-text-primary text-[15px] font-bold">{title}</h3>
          <p className="text-text-muted text-[13px] leading-relaxed">{description}</p>
          <RiArrowRightLine className="text-text-placeholder group-hover:text-brand-purple-500 absolute top-5 right-5 h-[18px] w-[18px] transition group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  </section>
)
