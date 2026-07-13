import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiX } from 'react-icons/fi'
import { UserAvatar } from '@/components/shared/user-avatar'
import { cropSquareToDataUrl, ImageProcessingError } from '@/lib/resize-image'
import { extractApiError } from '@/lib/api-client'
import { useModalDismiss } from '@/hooks/use-modal-dismiss'
import { useUpdateProfile } from '../hooks/use-profile'

interface EditProfileModalProps {
  initialName: string
  initialAvatar: string | null
  onClose: () => void
}

/** Edit display name + avatar. Avatar state: `undefined` = unchanged, a data-URL
 *  string = new photo, `null` = removed. Only a changed avatar is sent. */
export function EditProfileModal({ initialName, initialAvatar, onClose }: EditProfileModalProps) {
  const [name, setName] = useState(initialName)
  const [avatar, setAvatar] = useState<string | null | undefined>(undefined)
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)
  const update = useUpdateProfile()
  const dialogRef = useModalDismiss(onClose)

  // Image processing is async and the modal can close first — don't setState after unmount.
  useEffect(
    () => () => {
      mountedRef.current = false
    },
    [],
  )

  const preview = avatar === undefined ? initialAvatar : avatar

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be re-picked after an error
    if (!file) return
    setProcessing(true)
    try {
      const dataUrl = await cropSquareToDataUrl(file)
      if (mountedRef.current) setAvatar(dataUrl)
    } catch (err) {
      if (mountedRef.current) {
        toast.error(
          err instanceof ImageProcessingError ? err.message : 'Could not process that image.',
        )
      }
    } finally {
      if (mountedRef.current) setProcessing(false)
    }
  }

  const handleSave = () => {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }
    const body: { username: string; avatarUrl?: string | null } = { username: trimmed }
    if (avatar !== undefined) body.avatarUrl = avatar
    update.mutate(body, {
      onSuccess: () => {
        toast.success('Profile updated')
        onClose()
      },
      onError: (err) => toast.error(extractApiError(err).message ?? 'Could not update profile'),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-bg-card w-full max-w-md rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-text-primary text-lg font-bold">Edit profile</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-placeholder hover:bg-bg-section hover:text-text-secondary focus-visible:ring-brand-purple-300 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="border-border-input bg-bg-section flex items-center gap-4 rounded-2xl border border-dashed p-4">
          <UserAvatar src={preview} name={name} className="h-16 w-16" />
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFile}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={processing}
                className="bg-brand-purple-500 hover:bg-brand-purple-600 focus-visible:ring-brand-purple-300 rounded-lg px-3.5 py-1.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
              >
                {processing ? 'Processing…' : 'Upload photo'}
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={() => setAvatar(null)}
                  className="border-border-input text-text-primary hover:bg-bg-card focus-visible:ring-brand-purple-300 rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-text-muted mt-2 text-xs">
              PNG / JPG / WebP. Cropped to a square, ~256px.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-text-primary text-xs font-semibold" htmlFor="display-name">
            Display name
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-border-input focus:border-brand-purple-500 mt-1.5 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-200 outline-none"
          />
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
            onClick={handleSave}
            disabled={update.isPending || processing}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
          >
            {update.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
