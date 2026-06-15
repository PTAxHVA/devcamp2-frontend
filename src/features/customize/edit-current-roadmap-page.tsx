import { useMemo, useState, useCallback } from 'react'
import { BaseRoadmapNode, type BaseNodeData } from '@/features/roadmap/components/base-roadmap-node'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'
import { useParams, useNavigate } from 'react-router'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  RiArrowLeftLine,
  RiBookmarkLine,
  RiAlertLine,
  RiAddLine,
  RiSubtractLine,
  RiArrowUpLine,
  RiCloseLine,
  RiArrowDownLine,
  RiSparklingFill,
  RiLoader4Line,
} from 'react-icons/ri'

export default function EditCurrentRoadmapPage() {
  const { id: roadmapId } = useParams()
  const navigate = useNavigate()

  const nodeTypes = useMemo(() => ({ editNode: BaseRoadmapNode }), [])
  const [showAlert, setShowAlert] = useState(true)

  // --- DỮ LIỆU KHỞI TẠO MOCK BAN ĐẦU ---
  const initialNodes: Node<BaseNodeData>[] = [
    {
      id: '1',
      type: 'editNode',
      position: { x: 250, y: 20 },
      data: { label: 'Web Fundamentals', number: '1', status: 'completed' },
    },
    {
      id: '2',
      type: 'editNode',
      position: { x: 50, y: 120 },
      data: { label: 'HTML & CSS', number: '2', status: 'current' },
    },
    {
      id: '3',
      type: 'editNode',
      position: { x: 450, y: 120 },
      data: { label: 'JavaScript Basics', number: '3', status: 'upcoming' },
    },
    {
      id: '4',
      type: 'editNode',
      position: { x: 250, y: 240 },
      data: { label: 'DOM & Events', number: '4', status: 'upcoming' },
    },
    {
      id: '5',
      type: 'editNode',
      position: { x: 250, y: 360 },
      data: { label: 'React Basics', number: '5', status: 'upcoming' },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // --- STATE QUẢN LÝ CONTROLLED FORM ---
  const [selectedNode, setSelectedNode] = useState<Node<BaseNodeData> | null>(initialNodes[1]) // Mặc định chọn node 2
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState('Core Topic')
  const [formTime, setFormTime] = useState('4-6 weeks')
  const [formRequired, setFormRequired] = useState(true)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<BaseNodeData>)
  }, [])

  const saveRoadmapMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.put(`/roadmaps/${roadmapId}/customize`, { nodes, edges })
      return response.data
    },
    onSuccess: () => {
      logger.info('Roadmap changes saved successfully', roadmapId || 'unknown_id')
      navigate(`/roadmaps/${roadmapId}`)
    },
    onError: (error) => {
      logger.error(
        'Failed to save roadmap changes:',
        error instanceof Error ? error.message : String(error),
      )
    },
  })

  const autoRebuildGraph = (currentNodes: Node<BaseNodeData>[]) => {
    const updatedNodes = currentNodes.map((n, i) => ({
      ...n,
      data: { ...n.data, number: (i + 1).toString() },
    }))

    const nodeIds = new Set(updatedNodes.map((n) => n.id))
    const validEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))

    updatedNodes.forEach((node, idx) => {
      if (idx === 0) return
      const hasParent = validEdges.some((e) => e.target === node.id)
      if (!hasParent) {
        validEdges.push({
          id: `e${updatedNodes[idx - 1].id}-${node.id}`,
          source: updatedNodes[idx - 1].id,
          target: node.id,
          type: 'smoothstep',
          style: { stroke: '#CBD5E1', strokeWidth: 2 },
        })
      }
    })

    setNodes(updatedNodes)
    setEdges(validEdges)
  }

  // --- ACTIONS TRÊN TOOLBAR ---
  const handleAddTopic = () => {
    const nextId = nodes.length > 0 ? Math.max(...nodes.map((n) => parseInt(n.id) || 0)) + 1 : 1
    const lastNode = nodes[nodes.length - 1]

    const newNode: Node<BaseNodeData> = {
      id: nextId.toString(),
      type: 'editNode',
      position: {
        x: lastNode ? lastNode.position.x : 250,
        y: lastNode ? lastNode.position.y + 120 : 50,
      },
      data: { label: 'New Topic Spec', number: '', status: 'upcoming' },
    }

    const updatedNodes = [...nodes, newNode]
    const newEdge: Edge = {
      id: `e${lastNode?.id || '1'}-${nextId}`,
      source: lastNode?.id || '1',
      target: nextId.toString(),
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    }

    autoRebuildGraph(updatedNodes)
    setEdges((eds) => [...eds, newEdge])
    setSelectedNode(newNode)
  }

  const handleRemoveTopic = () => {
    if (!selectedNode || selectedNode.id === '1') return // Chặn xóa node gốc
    if (selectedNode.data.status === 'completed') {
      alert('Cannot remove a completed topic!')
      return
    }

    const filteredNodes = nodes.filter((n) => n.id !== selectedNode.id)
    autoRebuildGraph(filteredNodes)
    setSelectedNode(filteredNodes[0] || null)
  }

  const handleMoveNode = (direction: 'up' | 'down') => {
    if (!selectedNode) return
    const index = nodes.findIndex((n) => n.id === selectedNode.id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === nodes.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const updatedNodes = [...nodes]

    // Hoán đổi vị trí cấu trúc mảng
    const tempNode = updatedNodes[index]
    updatedNodes[index] = updatedNodes[targetIndex]
    updatedNodes[targetIndex] = tempNode

    const tempY = updatedNodes[index].position.y
    updatedNodes[index].position.y = updatedNodes[targetIndex].position.y
    updatedNodes[targetIndex].position.y = tempY

    autoRebuildGraph(updatedNodes)
  }

  const updateGraphNodeData = (field: string, value: string | boolean) => {
    if (!selectedNode) return
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, [field]: value } } : n,
      ),
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-white p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-800"
        >
          <RiArrowLeftLine /> Back
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Edit current roadmap</h1>
          <RiBookmarkLine className="text-2xl text-purple-600" />
        </div>
      </div>

      {/* Alert Warning */}
      {showAlert && (
        <div className="mb-6 flex items-start justify-between rounded-xl border border-orange-200 bg-orange-50 p-4 transition-all">
          <div className="flex gap-3">
            <RiAlertLine className="mt-0.5 text-lg text-orange-500" />
            <div>
              <h4 className="font-bold text-orange-900">Edits may affect your future progress.</h4>
              <p className="text-sm text-orange-700">Completed topics cannot be removed.</p>
            </div>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="rounded-lg p-1 text-orange-500 hover:bg-orange-100"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col gap-6 lg:flex-row min-h-150">
        {/* === CANVAS BÊN TRÁI === */}
        <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white">
          {/* Toolbar xử lý Mutation thực sự */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddTopic}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
              >
                <RiAddLine className="text-purple-600" /> Add topic
              </button>
              <button
                onClick={handleRemoveTopic}
                disabled={!selectedNode || selectedNode.id === '1'}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 disabled:opacity-40"
              >
                <RiSubtractLine className="text-red-500" /> Remove topic
              </button>
              <div className="mx-2 h-5 w-px bg-slate-200" />
              <button
                onClick={() => handleMoveNode('up')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
              >
                <RiArrowUpLine className="text-purple-600" /> Move up
              </button>
              <button
                onClick={() => handleMoveNode('down')}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
              >
                <RiArrowDownLine className="text-purple-600" /> Move down
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-slate-50/50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#cbd5e1" gap={20} size={1} />
              <Controls className="right-4! top-4! bottom-auto! flex! flex-row! gap-1! border-none! shadow-sm!" />
            </ReactFlow>
          </div>
        </div>

        {/* === CONTROLLED FORM BÊN PHẢI === */}
        <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:w-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Topic details</h2>

          {selectedNode ? (
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value)
                    updateGraphNodeData('label', e.target.value)
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value)
                    updateGraphNodeData('description', e.target.value)
                  }}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      setFormType(e.target.value)
                      updateGraphNodeData('type', e.target.value)
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option>Core Topic</option>
                    <option>Optional</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Estimated time
                  </label>
                  <select
                    value={formTime}
                    onChange={(e) => {
                      setFormTime(e.target.value)
                      updateGraphNodeData('estimatedTime', e.target.value)
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <option>4-6 weeks</option>
                    <option>1-2 weeks</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-sm font-bold text-slate-900">Required</p>
                  <p className="text-xs text-slate-500">
                    Mark as required to keep this topic in path.
                  </p>
                </div>
                <div
                  onClick={() => {
                    const nextVal = !formRequired
                    setFormRequired(nextVal)
                    updateGraphNodeData('status', nextVal ? 'upcoming' : 'locked')
                  }}
                  className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors ${formRequired ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${formRequired ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              Select a topic on the canvas to configure.
            </div>
          )}
        </div>
      </div>

      {/* Footer chứa nút bấm tích hợp Backend thật */}
      <div className="mt-6 flex flex-col items-end gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4 rounded-xl border border-purple-100 bg-purple-50/50 p-4 w-full lg:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm">
            <RiSparklingFill className="text-xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900">AI feedback</h4>
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Edits look valid. Structure has been automatically synchronized.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => saveRoadmapMutation.mutate()}
            disabled={saveRoadmapMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-[#0B1528] px-6 py-2.5 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {saveRoadmapMutation.isPending && <RiLoader4Line className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
