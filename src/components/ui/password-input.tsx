import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * Password field with a built-in show/hide toggle.
 * Forwards its ref so it drops straight into react-hook-form's `register(...)`.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          // pr-11 keeps typed text clear of the toggle button; cn() lets it win over
          // any horizontal padding the caller passes.
          className={cn(className, 'pr-11')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          // Keep the eye out of the tab order — it's a convenience, not a field.
          tabIndex={-1}
          className="text-text-muted hover:text-text-secondary focus-visible:ring-brand-purple-300 absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          {show ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
