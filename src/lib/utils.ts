import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classNames safely.
 * Example: cn("p-4", isActive && "bg-blue-500", "p-6") → "bg-blue-500 p-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
