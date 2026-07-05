import { FiAward } from 'react-icons/fi'
import { VoraWordmark } from '@/components/ui/vora-logo'

interface CertificateCardProps {
  username: string
  roleName: string | null
  topicsCount: number
}

/**
 * Printable roadmap-completion certificate. `certificate-print-area` is picked
 * up by the @media print rules in index.css so window.print() outputs ONLY this
 * card. KISS: browser print → "Save as PDF", no PDF library.
 */
export function CertificateCard({ username, roleName, topicsCount }: CertificateCardProps) {
  const issuedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const roadmapLabel = roleName ? `the ${roleName} roadmap` : 'their VORA roadmap'

  return (
    <div className="certificate-print-area border-brand-purple-300 rounded-[1.75rem] border-4 bg-white p-2">
      <div className="border-border-soft flex flex-col items-center gap-5 rounded-3xl border px-6 py-10 text-center sm:px-12">
        <VoraWordmark />
        <div>
          <p className="text-brand-purple-600 text-[11px] font-bold tracking-[0.3em] uppercase">
            Certificate of Completion
          </p>
          <h2 className="text-text-primary mt-4 text-3xl font-black sm:text-4xl">{username}</h2>
          <p className="text-text-muted mx-auto mt-4 max-w-md text-sm leading-relaxed">
            has completed {roadmapLabel} on VORA — all {topicsCount} topic
            {topicsCount === 1 ? '' : 's'} finished, with every section verified by passing its quiz
            (≥80%).
          </p>
        </div>
        <div className="border-border-soft flex w-full items-center justify-between border-t pt-5">
          <div className="text-left">
            <p className="text-text-primary text-xs font-bold">Issued on</p>
            <p className="text-text-muted text-xs">{issuedOn}</p>
          </div>
          <div className="bg-bg-lavender text-brand-purple-600 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
            <FiAward className="h-4 w-4" /> Quiz-verified
          </div>
        </div>
      </div>
    </div>
  )
}
