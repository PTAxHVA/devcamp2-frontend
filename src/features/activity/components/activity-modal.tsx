import { FiX } from 'react-icons/fi'
import { useModalDismiss } from '@/hooks/use-modal-dismiss'
import { ActivityPanel } from './activity-panel'

/** Dashboard "View full" dialog wrapping the shared activity panel. */
export function ActivityModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useModalDismiss(onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Your learning activity"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-bg-card w-full max-w-2xl rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-text-primary text-lg font-bold">Your learning activity</h3>
            <p className="text-text-muted text-sm">Last 30 days</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-placeholder hover:bg-bg-section hover:text-text-secondary focus-visible:ring-brand-purple-300 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>
        <ActivityPanel />
      </div>
    </div>
  )
}
