import { RiTimeLine, RiListUnordered, RiBarChartBoxLine } from 'react-icons/ri'

interface RoadmapCardProps {
  data: {
    _id?: string
    roleName?: string
    title?: string
    name?: string
    description?: string
    difficulty?: string
    duration?: string
    topicsCount?: number
    tag?: string
  }
}

export default function RoadmapCard({ data }: RoadmapCardProps) {
  const displayTitle = data.roleName || data.title || data.name || 'Đang cập nhật tên lộ trình...'

  return (
    <div className="border border-slate-200 rounded-3xl p-5 bg-white shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-all">
      <div
        className={`h-36 rounded-2xl mb-4 flex items-center justify-center p-4 text-center border border-transparent
        ${
          displayTitle.toLowerCase().includes('frontend')
            ? 'bg-linear-to-brrom-blue-50 to-indigo-100 border-indigo-200'
            : displayTitle.toLowerCase().includes('backend')
              ? 'bg-linear-to-br from-emerald-50 to-teal-100 border-teal-200'
              : 'bg-linear-to-br from-slate-50 to-gray-100 border-slate-200'
        }`}
      >
        <span
          className={`font-black text-xl opacity-80
          ${
            displayTitle.toLowerCase().includes('frontend')
              ? 'text-indigo-600'
              : displayTitle.toLowerCase().includes('backend')
                ? 'text-teal-600'
                : 'text-slate-400'
          }`}
        >
          {displayTitle}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-[17px] mb-1.5 leading-tight">
          {displayTitle}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {data.description || 'Chưa có mô tả chi tiết cho lộ trình này.'}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-5">
          <span className="flex items-center gap-1">
            <RiBarChartBoxLine size={16} className="text-slate-400" />
            {data.difficulty || 'Beginner'}
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine size={16} className="text-slate-400" />
            {data.duration || '8-10 weeks'}
          </span>
          <span className="flex items-center gap-1">
            <RiListUnordered size={16} className="text-slate-400" />
            {data.topicsCount || 0} topics
          </span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 border-2 border-brand-purple-600 text-brand-purple-600 rounded-xl py-2 text-sm font-bold hover:bg-brand-purple-50 transition-colors">
            Preview
          </button>
          <button className="flex-1 bg-[#0f3460] text-white rounded-xl py-2 text-sm font-bold hover:bg-[#0a2545] transition-colors">
            Use roadmap
          </button>
        </div>
      </div>
    </div>
  )
}
