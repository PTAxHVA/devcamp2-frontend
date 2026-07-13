import { FiLogOut, FiCheck } from 'react-icons/fi'
import { useModalDismiss } from '@/hooks/use-modal-dismiss'

interface UnregisterModalProps {
  roadmapName: string
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

/** Confirm leaving a roadmap. Reassures that progress is kept (soft-delete on the
 *  BE) so this reads as reversible, not destructive. */
export function UnregisterModal({
  roadmapName,
  isPending,
  onConfirm,
  onClose,
}: UnregisterModalProps) {
  const dialogRef = useModalDismiss(onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Unregister from ${roadmapName}`}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-bg-card w-full max-w-md rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <FiLogOut size={22} />
        </span>
        <h3 className="text-text-primary text-lg font-bold">Unregister from {roadmapName}?</h3>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">
          You'll stop following this roadmap and it will leave <b>My Learning</b>.
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
          <FiCheck className="mt-0.5 shrink-0 text-green-600" />
          <span className="text-sm leading-snug text-green-700">
            <b>Your progress is saved.</b> Re-enroll anytime from Browse to pick up exactly where
            you left off.
          </span>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border-border-input text-text-primary hover:bg-bg-section focus-visible:ring-brand-purple-300 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
          >
            <FiLogOut /> {isPending ? 'Removing…' : 'Unregister'}
          </button>
        </div>
      </div>
    </div>
  )
}
