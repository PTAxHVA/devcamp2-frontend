import { RiSearchLine, RiLightbulbFlashLine, RiKey2Line } from 'react-icons/ri'
import { type Node, type Edge } from '@xyflow/react'
import { RoadmapGraph } from '@/features/roadmap/components/roadmap-graph'
import { type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'

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

  const previewNodes: Node<BaseNodeData>[] = [
    {
      id: '1',
      type: 'roadmapNode',
      position: { x: 100, y: 30 },
      data: { number: '1', label: 'Web Fundamentals', status: 'completed', variant: 'onboarding' },
    },
    {
      id: '2',
      type: 'roadmapNode',
      position: { x: 100, y: 150 },
      data: { number: '2', label: 'HTML & CSS', status: 'current', variant: 'onboarding' },
    },
    {
      id: '3',
      type: 'roadmapNode',
      position: { x: 100, y: 270 },
      data: { number: '3', label: 'JavaScript Basics', status: 'upcoming', variant: 'onboarding' },
    },
  ]

  const previewEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
  ]

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-start mt-8 animate-in fade-in duration-700">
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

      <div className="flex-1 w-full lg:max-w-xl">
        <div className="border border-slate-200 rounded-2xl p-8 bg-white shadow-sm h-full">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Your roadmap review</h2>
          <p className="text-sm text-slate-500 mb-8">
            This is a preview. Final roadmap may adjust as we personalize it for you.
          </p>

          <div className="w-full h-95 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-60 grayscale transition-all duration-1000">
              <RoadmapGraph
                nodes={previewNodes}
                edges={previewEdges}
                isReadOnly={true}
                withUI={false}
              />
            </div>

            <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-50/40 to-slate-50 z-20 flex items-end justify-center pb-8 pointer-events-none">
              <span className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-full text-xs font-bold text-brand-purple-600 border border-brand-purple-100 shadow-sm animate-pulse flex items-center gap-2">
                <RiLightbulbFlashLine className="w-4 h-4" /> Generating topics...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
