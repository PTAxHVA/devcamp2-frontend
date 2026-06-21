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
      icon: <RiSearchLine className="h-7 w-7" />,
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Matching the best roadmap',
      desc: 'Selecting the right skills and resources to reach your goals.',
      icon: <RiLightbulbFlashLine className="h-7 w-7" />,
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Ordering topics and milestones',
      desc: 'Structuring the roadmap in the most effective learning order.',
      icon: <RiKey2Line className="h-7 w-7" />,
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
    <div className="animate-in fade-in mt-8 flex w-full flex-col items-start gap-12 duration-700 lg:flex-row">
      <div className="w-full flex-1">
        <h1 className="mb-4 text-4xl leading-tight font-bold text-[#0B1528] md:text-5xl">
          AI is creating your <br /> personalized roadmap
        </h1>
        <p className="text-text-muted mb-10 max-w-md text-lg">
          Our AI analyzes your profile, matches the best learning path, and organizes topics just
          for you.
        </p>

        <div className="flex flex-col gap-5">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="border-border-soft flex items-center gap-6 rounded-2xl border bg-white p-6 shadow-sm"
            >
              {/* Icon */}
              <div className="bg-bg-lavender text-brand-purple-600 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                {step.icon}
              </div>

              {/* Text */}
              <div className="flex-1 pr-4">
                <h3 className="text-text-primary mb-1 text-lg font-bold">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <div className="border-border-soft text-text-primary rounded-lg border-2 bg-white px-6 py-2 text-sm font-bold">
                  {step.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex-1 lg:max-w-xl">
        <div className="border-border-soft h-full rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-text-primary mb-1 text-xl font-bold">Your roadmap review</h2>
          <p className="text-text-muted mb-8 text-sm">
            This is a preview. Final roadmap may adjust as we personalize it for you.
          </p>

          <div className="border-border-soft bg-bg-section/50 relative flex h-95 w-full items-center justify-center overflow-hidden rounded-xl border">
            <div className="pointer-events-none absolute inset-0 opacity-60 grayscale transition-all duration-1000">
              <RoadmapGraph
                nodes={previewNodes}
                edges={previewEdges}
                isReadOnly={true}
                withUI={false}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-linear-to-b from-transparent via-slate-50/40 to-slate-50 pb-8">
              <span className="text-brand-purple-600 border-brand-purple-100 flex animate-pulse items-center gap-2 rounded-full border bg-white/90 px-5 py-2.5 text-xs font-bold shadow-sm backdrop-blur">
                <RiLightbulbFlashLine className="h-4 w-4" /> Personalizing topics...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
