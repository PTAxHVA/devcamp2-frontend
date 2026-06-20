import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="bg-bg-soft flex min-h-screen flex-col items-center justify-center gap-6">
      <p className="text-brand-purple-300 text-8xl font-extrabold">404</p>
      <div className="text-center">
        <h1 className="text-text-primary mb-2 text-2xl font-extrabold">Không tìm thấy trang</h1>
        <p className="text-text-muted text-sm">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="bg-btn-primary-bg hover:bg-btn-primary-hover rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
        >
          Về Dashboard
        </Link>
        <Link
          to="/"
          className="border-border-input text-text-primary hover:bg-bg-section rounded-xl border px-5 py-2.5 text-sm font-semibold transition"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
