import { RiArrowDownSLine } from 'react-icons/ri'
import { FAQ_GROUPS } from '../support-content'

/**
 * Grouped FAQ built on native <details>/<summary> so keyboard and screen-reader
 * behaviour come for free. The first item of the first group opens by default.
 */
export const FaqSection = () => (
  <section aria-labelledby="faq-heading">
    <p className="text-brand-purple-600 text-xs font-bold tracking-[0.12em] uppercase">FAQ</p>
    <h2 id="faq-heading" className="text-text-primary mt-1 text-xl font-extrabold">
      Frequently asked questions
    </h2>

    <div className="mt-4 flex flex-col gap-5">
      {FAQ_GROUPS.map((group, groupIndex) => (
        <div key={group.label}>
          <span className="bg-bg-lavender text-brand-purple-700 inline-flex rounded-full px-3 py-1.5 text-[13px] font-bold">
            {group.label}
          </span>
          <div className="mt-3 flex flex-col gap-2.5">
            {group.items.map((item, itemIndex) => (
              <details
                key={item.question}
                open={groupIndex === 0 && itemIndex === 0}
                className="group border-border-soft open:border-brand-purple-300 overflow-hidden rounded-2xl border bg-white"
              >
                <summary className="text-text-primary hover:text-brand-purple-700 flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <RiArrowDownSLine className="text-text-placeholder group-open:text-brand-purple-500 h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-text-secondary px-4 pb-4 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
)
