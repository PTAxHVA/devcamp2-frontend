import { useState } from 'react'
import { useNavigate } from 'react-router'
import { type Node, type Edge } from '@xyflow/react'

import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiTimeLine,
  RiListUnordered,
  RiBarChartBoxLine,
  RiStarLine,
  RiCheckLine,
  RiCheckboxCircleFill,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiBookmark2Line,
} from 'react-icons/ri'

import { roadmapInfo, selectedTopicDetails } from './roadmap-view-data'
import { type TopicNodeData } from './components/topic-node'
import RoadmapTree from './components/roadmap-tree'

const RoadmapViewPage = () => {
  const navigate = useNavigate()

  const [currentTopic, setCurrentTopic] = useState(selectedTopicDetails)
  const initialNodes: Node<TopicNodeData>[] = [
    {
      id: '1',
      type: 'roadmapNode',
      data: { index: 1, label: 'Web Fundamentals', status: 'completed' },
      position: { x: 250, y: 20 },
    },
    {
      id: '2',
      type: 'roadmapNode',
      data: { index: 2, label: 'HTML & CSS', status: 'completed' },
      position: { x: 80, y: 140 },
    },
    {
      id: '3',
      type: 'roadmapNode',
      data: { index: 3, label: 'JavaScript Basics', status: 'in_progress' },
      position: { x: 420, y: 140 },
    },
    {
      id: '4',
      type: 'roadmapNode',
      data: { index: 4, label: 'DOM & Events', status: 'available' },
      position: { x: 250, y: 260 },
    },
    {
      id: '5',
      type: 'roadmapNode',
      data: { index: 5, label: 'Git & GitHub', status: 'available' },
      position: { x: -80, y: 380 },
    },
    {
      id: '6',
      type: 'roadmapNode',
      data: { index: 6, label: 'React Basics', status: 'available' },
      position: { x: 250, y: 380 },
    },
    {
      id: '7',
      type: 'roadmapNode',
      data: { index: 7, label: 'Components & Props', status: 'available' },
      position: { x: 580, y: 380 },
    },
    {
      id: '8',
      type: 'roadmapNode',
      data: { index: 8, label: 'API Fetching', status: 'locked' },
      position: { x: 250, y: 500 },
    },
    {
      id: '9',
      type: 'roadmapNode',
      data: { index: 9, label: 'Mini Project', status: 'locked' },
      position: { x: 250, y: 620 },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      type: 'smoothstep',
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    },
    {
      id: 'e6-8',
      source: '6',
      target: '8',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
    {
      id: 'e8-9',
      source: '8',
      target: '9',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '5,5' },
    },
  ]

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    const nodeData = node.data as TopicNodeData

    setCurrentTopic({
      ...selectedTopicDetails,
      id: parseInt(node.id),
      title: nodeData.label,
      progress: nodeData.status === 'completed' ? 100 : nodeData.status === 'in_progress' ? 45 : 0,
    })
  }

  const handleGoToTopic = () => {
    navigate(`/topic/${currentTopic.id}`)
  }

  return (
    <div className="flex h-full max-w-420">
      <div className="flex flex-1 flex-col overflow-hidden bg-white p-6 lg:p-8">
        <div className="w-full">
          <button className="mb-4 flex items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800">
            <RiArrowLeftLine /> Back to all roadmaps
          </button>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{roadmapInfo.title}</h1>
            <RiBookmarkLine className="text-2xl text-purple-600" />
          </div>
          <p className="mb-4 text-sm text-slate-600">{roadmapInfo.description}</p>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiTimeLine /> {roadmapInfo.duration}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiListUnordered /> {roadmapInfo.topicsCount} topics
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600">
              <RiBarChartBoxLine /> {roadmapInfo.difficulty}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-purple-700">
              <RiStarLine /> {roadmapInfo.tag}
            </div>
          </div>
        </div>

        <RoadmapTree nodes={initialNodes} edges={initialEdges} onNodeClick={handleNodeClick} />
      </div>

      <aside className="flex w-95 shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Current Topic
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{currentTopic.title}</h2>

          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-700">Progress</span>
              <span className="text-slate-900">{currentTopic.progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{ width: `${currentTopic.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold text-slate-900">Prerequisites</h3>
            <ul className="space-y-2.5">
              {currentTopic.prerequisites.map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                    <RiCheckLine className="text-xs" />
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-sm font-bold text-slate-900">About this topic</h3>
            <p className="text-sm leading-relaxed text-slate-600">{currentTopic.description}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">You'll learn</h3>
            <ul className="space-y-3">
              {currentTopic.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <RiCheckboxCircleFill className="mt-0.5 text-base text-purple-600 shrink-0" />
                  <span className="font-medium">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6 space-y-3 bg-white">
          <button
            onClick={handleGoToTopic}
            className="flex w-full items-center justify-between rounded-xl bg-[#0B1528] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            Continue learning <RiArrowRightLine className="text-lg" />
          </button>
          <button
            onClick={handleGoToTopic}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            View lessons <RiExternalLinkLine className="text-lg text-slate-400" />
          </button>
          <button className="mt-2 flex w-full items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors pt-2">
            <RiBookmark2Line className="text-lg" /> Save for later
          </button>
        </div>
      </aside>
    </div>
  )
}

export default RoadmapViewPage
