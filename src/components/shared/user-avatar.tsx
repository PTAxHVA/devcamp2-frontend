import { useState } from 'react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  className?: string
}

/**
 * Profile picture: the uploaded photo when set, otherwise a neutral grey
 * silhouette (Facebook-style). Never initials — a missing avatar reads clearly
 * as "no photo yet". Used in the nav-bar chip, the profile header, and the
 * edit-profile modal preview.
 */
export function UserAvatar({ src, name, className }: UserAvatarProps) {
  // Remember which src failed so a broken photo falls back to the silhouette, while a
  // NEW src is retried — derived from src each render, no effect needed.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const label = name ? `${name}'s avatar` : 'Avatar'

  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt={label}
        onError={() => setFailedSrc(src)}
        className={cn('rounded-full object-cover', className)}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={name ? `${name}'s avatar` : 'Default avatar'}
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-full',
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <rect width="100" height="100" fill="#e2e8f0" />
        <circle cx="50" cy="40" r="17" fill="#b7c1cd" />
        <path d="M22 88 a28 28 0 0 1 56 0 z" fill="#b7c1cd" />
      </svg>
    </span>
  )
}
