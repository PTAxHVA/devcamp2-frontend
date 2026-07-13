import { VoraMark } from '@/components/ui/vora-logo'
import { QuickLinks } from './components/quick-links'
import { FaqSection } from './components/faq-section'
import { GoodToKnow } from './components/good-to-know'

/**
 * /support — Help & Support. Self-help only (no contact form): a hero, quick
 * links to the real flows, a grounded FAQ, and a "Good to know" callout.
 */
export default function SupportPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7 px-4 py-6 lg:px-8">
      <section className="border-border-soft from-bg-lavender via-bg-blue-soft relative overflow-hidden rounded-3xl border bg-gradient-to-br to-white p-8 sm:p-10">
        <p className="text-brand-purple-600 text-xs font-bold tracking-[0.14em] uppercase">
          Help &amp; Support
        </p>
        <h1 className="text-brand-navy-900 mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          How can we help?
        </h1>
        <p className="text-text-muted mt-2.5 max-w-lg text-base leading-relaxed">
          Answers to the questions we hear most about learning on VORA — quizzes, roadmaps, streaks
          and your Skill Passport.
        </p>
        {/* Decorative brand glyph — desktop only so it can't overlap the copy on
            the narrower tablet width (sidebar + content). */}
        <VoraMark
          decorative
          className="pointer-events-none absolute top-1/2 -right-3 hidden h-44 w-44 -translate-y-1/2 opacity-90 lg:block"
        />
      </section>

      <QuickLinks />
      <FaqSection />
      <GoodToKnow />
    </div>
  )
}
