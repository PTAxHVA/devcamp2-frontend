import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SwitchPathPanel from '../components/switch-path-panel'
import type { ForkableBranch } from '@/features/roadmap/lib/branch-selection'

const core: ForkableBranch = {
  _id: 'core',
  name: 'Node + Express Core',
  isMandatory: true,
  orderIndex: 0,
  topicIds: ['a', 'b', 'tail'],
}
const mongo: ForkableBranch = {
  _id: 'mongo',
  name: 'MongoDB',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 1,
  topicIds: ['m'],
}
const pg: ForkableBranch = {
  _id: 'pg',
  name: 'PostgreSQL',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 2,
  topicIds: ['p'],
}
const branches = [core, mongo, pg]
const noProgress = () => false

describe('SwitchPathPanel', () => {
  it('renders nothing when the roadmap has no fork group', () => {
    const { container } = render(
      <SwitchPathPanel
        branches={[{ _id: 'b1', name: 'Only', orderIndex: 0 }]}
        canvasTopicIds={['a']}
        hasProgressOn={noProgress}
        isBusy={false}
        onSwitch={vi.fn()}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('emits the exact add/remove swap for the alternative path', () => {
    const onSwitch = vi.fn()
    render(
      <SwitchPathPanel
        branches={branches}
        canvasTopicIds={['a', 'b', 'm', 'tail']}
        hasProgressOn={noProgress}
        isBusy={false}
        onSwitch={onSwitch}
      />,
    )

    expect(screen.getByText(/Database path: MongoDB/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /switch to postgresql/i }))
    expect(onSwitch).toHaveBeenCalledWith({
      addTopicIds: ['p'],
      removeTopicIds: ['m'],
      toName: 'PostgreSQL',
    })
  })

  it('disables the switch (with a note) once the current path has progress', () => {
    const onSwitch = vi.fn()
    render(
      <SwitchPathPanel
        branches={branches}
        canvasTopicIds={['a', 'b', 'm', 'tail']}
        hasProgressOn={(id) => id === 'm'}
        isBusy={false}
        onSwitch={onSwitch}
      />,
    )

    const button = screen.getByRole('button', { name: /switch to postgresql/i })
    expect(button).toBeDisabled()
    expect(screen.getByText(/already started MongoDB/i)).toBeInTheDocument()
    fireEvent.click(button)
    expect(onSwitch).not.toHaveBeenCalled()
  })

  it('shows the both-paths note (no switch button) for a pre-fork enrollee', () => {
    render(
      <SwitchPathPanel
        branches={branches}
        canvasTopicIds={['a', 'b', 'p', 'm', 'tail']}
        hasProgressOn={noProgress}
        isBusy={false}
        onSwitch={vi.fn()}
      />,
    )
    expect(screen.getByText(/both paths are in this roadmap/i)).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
