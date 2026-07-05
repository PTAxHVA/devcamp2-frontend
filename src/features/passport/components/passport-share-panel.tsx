import { useState } from 'react'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { FiCheck, FiCopy, FiLinkedin } from 'react-icons/fi'
import { buildLinkedInShareUrl } from '../lib/passport-share'

interface PassportSharePanelProps {
  passportUrl: string
  /** Smaller QR + tighter layout for the settings card. */
  compact?: boolean
}

/** Copy-link + QR + LinkedIn share block, used on the public page and in Settings. */
export function PassportSharePanel({ passportUrl, compact = false }: PassportSharePanelProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(passportUrl)
      setIsCopied(true)
      toast.success('Passport link copied')
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Could not copy the link — copy it manually')
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${compact ? '' : 'sm:flex-row sm:items-center'}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={passportUrl}
            readOnly
            aria-label="Passport link"
            className="border-border-input bg-bg-section text-text-secondary min-w-0 flex-1 truncate rounded-lg border px-3 py-2 text-xs outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition"
          >
            {isCopied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
            {isCopied ? 'Copied' : 'Copy link'}
          </button>
        </div>
        <a
          href={buildLinkedInShareUrl(passportUrl)}
          target="_blank"
          rel="noreferrer"
          className="border-border-purple text-brand-purple-600 hover:bg-bg-lavender inline-flex w-fit items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition"
        >
          <FiLinkedin className="h-3.5 w-3.5" /> Share on LinkedIn
        </a>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <div className="border-border-soft bg-bg-card rounded-xl border p-2">
          <QRCodeSVG value={passportUrl} size={compact ? 88 : 120} aria-label="Passport QR code" />
        </div>
        <p className="text-text-muted text-[10px] font-medium tracking-wide uppercase">
          Scan to open
        </p>
      </div>
    </div>
  )
}
