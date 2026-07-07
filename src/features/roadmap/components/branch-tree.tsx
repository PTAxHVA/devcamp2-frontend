import { RiCheckLine } from 'react-icons/ri'
import type { MasterBranch } from '../hooks/use-master-roadmap'
import { groupBranches } from '../lib/branch-selection'

/**
 * Branch picker tree for the roadmap preview: branches render as connected
 * nodes in a vertical column. Ungrouped branches keep checkbox semantics
 * (mandatory ones are locked in); branches sharing a mutually-exclusive
 * selectionGroup render as a labeled radio set — pick exactly one path.
 */
export default function BranchTree({
  branches,
  selected,
  onToggle,
}: {
  branches: MasterBranch[]
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  const { ungrouped, groups } = groupBranches(branches)
  const rows: { branch: MasterBranch; group: string | null }[] = [
    ...ungrouped.map((b) => ({ branch: b, group: null as string | null })),
    ...groups.flatMap((g) =>
      g.branches.map((b) => ({ branch: b, group: g.selectionGroup as string | null })),
    ),
  ]

  return (
    <div className="relative flex flex-col gap-0">
      {rows.map(({ branch: b, group }, idx) => {
        const isSelected = selected.has(b._id)
        const isLast = idx === rows.length - 1
        const isMandatory = Boolean(b.isMandatory) && group === null
        const groupStartsHere = group !== null && rows[idx - 1]?.group !== group

        const cardCls = `mb-3 flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-purple-300 focus-visible:outline-none ${
          isSelected
            ? 'border-brand-purple-200 bg-bg-lavender'
            : 'border-border-soft bg-bg-section hover:border-border-input'
        }`

        const body = (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-sm font-bold">
                {b.name}
                {isMandatory && (
                  <span className="bg-bg-lavender text-brand-purple-600 ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold">
                    Included
                  </span>
                )}
              </p>
              {b.description && (
                <p className="text-text-muted mt-0.5 line-clamp-2 text-xs">{b.description}</p>
              )}
            </div>
            <span className="text-text-placeholder shrink-0 text-xs font-semibold">
              {b.topicCount} topic{b.topicCount === 1 ? '' : 's'}
            </span>
          </>
        )

        return (
          <div key={b._id}>
            {groupStartsHere && (
              <div className="mt-1 mb-2 ml-9 flex items-center gap-2">
                <span className="text-text-primary text-xs font-bold tracking-wider uppercase">
                  {group}
                </span>
                <span className="bg-bg-lavender text-brand-purple-600 rounded-full px-2 py-0.5 text-[10px] font-bold">
                  choose one
                </span>
              </div>
            )}
            <div className="flex items-start gap-3">
              {/* Vertical connector line + node dot */}
              <div className="flex flex-col items-center" style={{ width: 24, minWidth: 24 }}>
                <div
                  className={`mt-3 h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-200 ${
                    isSelected
                      ? 'border-brand-purple-600 bg-brand-purple-600'
                      : 'border-border-input bg-bg-card'
                  }`}
                />
                {!isLast && (
                  <div className="bg-border-soft w-0.5 flex-1" style={{ minHeight: 28 }} />
                )}
              </div>

              {group !== null ? (
                /* Radio row — exactly one branch per exclusive group */
                <label className={`${cardCls} cursor-pointer`}>
                  <input
                    type="radio"
                    name={`branch-group-${group}`}
                    className="radio radio-primary radio-sm mt-0.5 shrink-0"
                    checked={isSelected}
                    onChange={() => onToggle(b._id)}
                  />
                  {body}
                </label>
              ) : (
                /* Checkbox row — mandatory branches are locked in */
                <button
                  onClick={() => onToggle(b._id)}
                  disabled={isMandatory}
                  className={`${cardCls} ${isMandatory ? 'cursor-default' : ''}`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                      isSelected
                        ? 'border-brand-purple-600 bg-brand-purple-600 text-white'
                        : 'border-border-input'
                    }`}
                  >
                    {isSelected && <RiCheckLine className="h-3 w-3" />}
                  </div>
                  {body}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
