import { Component, type ReactNode } from 'react'

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-soft">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary">Có lỗi xảy ra</h1>
          <p className="text-sm text-text-muted">Vui lòng tải lại trang.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#003B71] text-white text-sm font-semibold hover:bg-[#082A5E] transition"
          >
            Tải lại trang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
