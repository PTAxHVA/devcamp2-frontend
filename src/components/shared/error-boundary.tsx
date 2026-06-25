import { Component, type ErrorInfo, type ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary', error.message, { error, componentStack: info.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-bg-soft flex min-h-screen flex-col items-center justify-center gap-4">
          <div className="bg-error-bg flex h-16 w-16 items-center justify-center rounded-full">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-text-primary text-xl font-bold">Something went wrong</h1>
          <p className="text-text-muted text-sm">Please reload the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
