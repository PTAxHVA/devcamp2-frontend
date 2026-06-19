import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-soft">
      <p className="text-8xl font-extrabold text-brand-purple-300">404</p>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-text-primary mb-2">Không tìm thấy trang</h1>
        <p className="text-sm text-text-muted">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#003B71] text-white text-sm font-semibold hover:bg-[#082A5E] transition"
        >
          Về Dashboard
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl border border-border-input text-sm font-semibold text-text-primary hover:bg-bg-section transition"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
