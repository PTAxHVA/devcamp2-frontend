import { useState } from 'react'
import { flushSync } from 'react-dom'
import { FiFileText, FiPrinter } from 'react-icons/fi'
import type { PassportRoadmap } from '../lib/passport-api'
import { CertificateCard } from './certificate-card'

interface PassportCertificatesProps {
  username: string
  roadmaps: PassportRoadmap[]
}

/** Completion certificates on the passport — one per fully-verified roadmap. */
export function PassportCertificates({ username, roadmaps }: PassportCertificatesProps) {
  const completedRoadmaps = roadmaps.filter((roadmap) => roadmap.isCompleted)
  const [printIndex, setPrintIndex] = useState<number | null>(null)

  // Commit `.print-target` on the chosen card BEFORE opening the print dialog
  // (the @media print rules isolate exactly that certificate), then clear it —
  // window.print() blocks until the dialog is dismissed.
  const handlePrint = (index: number) => {
    flushSync(() => setPrintIndex(index))
    window.print()
    flushSync(() => setPrintIndex(null))
  }

  if (completedRoadmaps.length === 0) return null

  return (
    <section>
      <h2 className="text-text-primary mb-3 flex items-center gap-2 text-sm font-bold">
        <FiFileText className="text-brand-purple-500 h-4 w-4" /> Certificates
      </h2>
      <div className="flex flex-col gap-5">
        {completedRoadmaps.map((roadmap, index) => (
          <div key={roadmap.name} className="flex flex-col gap-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handlePrint(index)}
                className="border-border-input text-text-primary hover:bg-bg-section bg-bg-card focus-visible:ring-brand-purple-300 inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
              >
                <FiPrinter className="h-3.5 w-3.5" /> Print / save as PDF
              </button>
            </div>
            <CertificateCard
              username={username}
              roleName={roadmap.name}
              topicsCount={roadmap.topicsCount}
              printTarget={printIndex === index}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
