import { RiSearchLine, RiLightbulbFlashLine, RiKey2Line } from 'react-icons/ri'

export const StepGenerating = () => {
  const processSteps = [
    {
      id: 1,
      title: 'Analyzing your profile',
      desc: 'Reviewing your goals, experience, and preferences.',
      icon: <RiSearchLine className="w-7 h-7" />,
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Matching the best roadmap',
      desc: 'Selecting the right skills and resources to reach your goals.',
      icon: <RiLightbulbFlashLine className="w-7 h-7" />,
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Ordering topics and milestones',
      desc: 'Structuring the roadmap in the most effective learning order.',
      icon: <RiKey2Line className="w-7 h-7" />,
      status: 'Pending',
    },
  ]

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-start mt-8 animate-in fade-in duration-700">
      {/* Cột Trái: Trạng thái xử lý */}
      <div className="flex-1 w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0B1528] mb-4 leading-tight">
          AI is creating your <br /> personalized roadmap
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-md">
          Our AI analyzes your profile, matches the best learning path, and organizes topics just
          for you.
        </p>

        <div className="flex flex-col gap-5">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-6 p-6 border border-slate-200 rounded-2xl bg-white shadow-sm"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center shrink-0">
                {step.icon}
              </div>

              {/* Text */}
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <div className="px-6 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-900 bg-white">
                  {step.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột Phải: Preview Roadmap */}
      <div className="flex-1 w-full lg:max-w-xl">
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm h-full">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Your roadmap review</h2>
          <p className="text-sm text-slate-500 mb-8">
            This is a preview. Final roadmap may adjust as we personalize it for you.
          </p>

          {/* Vùng chứa ảnh Placeholder - Bạn có thể thay bằng thẻ <img> thật của bạn */}
          <div className="w-full aspect-4/3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-center overflow-hidden">
            {/* TODO: Thay thẻ div này bằng ảnh roadmap mờ mờ của bạn
                Ví dụ: <img src="/images/roadmap-preview.png" alt="Preview" className="w-full h-full object-cover opacity-50" />
             */}
            <div className="text-slate-300 font-medium text-sm flex flex-col items-center gap-2">
              <div className="w-64 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                Roadmap Preview Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
