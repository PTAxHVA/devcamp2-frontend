import { useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import { useMyRoadmaps } from '@/features/learning/hooks/use-my-learning'
import { useAvailableTopics } from '@/features/roadmap/hooks/use-available-topics'
import { extractApiError } from '@/lib/api-client'
import { useAddMissingTopics } from '../hooks/use-job-readiness'
import { pickAddableTopicIds } from '../lib/gap-utils'
import type { GapTopicItem } from '../types'

interface AddMissingPanelProps {
  missing: GapTopicItem[]
}

/**
 * One-click "close the gap": adds the missing topics to one of the learner's
 * active roadmaps via the same PATCH the customize editor uses. Only topics the
 * roadmap can accept (available-topics) are offered — the rest are either
 * already enrolled or belong to another roadmap's branches.
 */
export function AddMissingPanel({ missing }: AddMissingPanelProps) {
  const { data: roadmaps } = useMyRoadmaps()
  const [pickedRoadmapId, setPickedRoadmapId] = useState('')
  const activeRoadmaps = (roadmaps ?? []).filter((r) => r.isActive)
  const roadmapId = pickedRoadmapId || activeRoadmaps[0]?._id || ''
  const availableQuery = useAvailableTopics(roadmapId)
  const addMutation = useAddMissingTopics(roadmapId)

  if (missing.length === 0) return null

  if (activeRoadmaps.length === 0) {
    return (
      <div className="border-border-soft rounded-3xl border bg-white p-6 text-center">
        <p className="text-text-primary text-sm font-bold">No active roadmap yet</p>
        <p className="text-text-muted mt-1 text-sm">
          Enroll in a roadmap first, then add the missing topics to it in one click.
        </p>
        <Link
          to="/roadmaps/browse"
          className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 mt-4 inline-block rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          Browse roadmaps
        </Link>
      </div>
    )
  }

  const addableIds = pickAddableTopicIds(
    missing,
    (availableQuery.data ?? []).map((t) => t.masterTopicId),
  )
  const addableNames = missing.filter((t) => addableIds.includes(t.topicId)).map((t) => t.name)

  const handleAdd = () => {
    addMutation.mutate(addableIds, {
      onSuccess: () => {
        toast.success(
          `Added ${addableIds.length} topic${addableIds.length === 1 ? '' : 's'} to your roadmap.`,
        )
      },
      onError: (err) => {
        const { message } = extractApiError(err)
        toast.error(message ?? 'Could not add the topics. Please try again.')
      },
    })
  }

  return (
    <div className="border-border-soft rounded-3xl border bg-white p-6">
      <h3 className="text-text-primary text-sm font-bold">Close the gap</h3>
      {activeRoadmaps.length > 1 && (
        <select
          value={roadmapId}
          onChange={(e) => setPickedRoadmapId(e.target.value)}
          aria-label="Roadmap to add topics to"
          className="focus:border-brand-purple-500 border-border-soft mt-3 w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-medium transition-colors duration-200 outline-none sm:max-w-xs"
        >
          {activeRoadmaps.map((r) => (
            <option key={r._id} value={r._id}>
              {r.roleName ?? 'My roadmap'}
            </option>
          ))}
        </select>
      )}

      {availableQuery.isLoading ? (
        <p className="text-text-muted mt-3 text-sm">Checking which topics can be added…</p>
      ) : addableIds.length > 0 ? (
        <>
          <p className="text-text-muted mt-2 text-sm">
            Can be added to this roadmap: {addableNames.join(', ')}.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={addMutation.isPending}
            className="bg-btn-primary-bg hover:bg-btn-primary-hover focus-visible:ring-brand-purple-300 mt-4 inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
          >
            <FiPlus className="h-4 w-4" />
            {addMutation.isPending
              ? 'Adding…'
              : `Add ${addableIds.length} missing topic${addableIds.length === 1 ? '' : 's'} to my roadmap`}
          </button>
        </>
      ) : (
        <p className="text-text-muted mt-2 text-sm">
          The missing topics are already in your roadmap or not offered by it — open{' '}
          <Link
            to="/my-learning"
            className="text-brand-purple-600 hover:text-brand-purple-700 focus-visible:ring-brand-purple-300 font-semibold transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            My Learning
          </Link>{' '}
          to start verifying them.
        </p>
      )}
    </div>
  )
}
