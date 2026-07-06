import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BranchTree from '../components/branch-tree'
import type { MasterBranch } from '../hooks/use-master-roadmap'

const core: MasterBranch = {
  _id: 'core',
  name: 'Node + Express Core',
  isMandatory: true,
  orderIndex: 0,
  topicCount: 7,
}
const mongo: MasterBranch = {
  _id: 'mongo',
  name: 'MongoDB',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 1,
  topicCount: 1,
}
const pg: MasterBranch = {
  _id: 'pg',
  name: 'PostgreSQL',
  selectionGroup: 'Database',
  isMutuallyExclusive: true,
  orderIndex: 2,
  topicCount: 1,
}

describe('BranchTree', () => {
  it('renders exclusive-group branches as one radio set with a group label', () => {
    const onToggle = vi.fn()
    render(
      <BranchTree
        branches={[core, mongo, pg]}
        selected={new Set(['core', 'mongo'])}
        onToggle={onToggle}
      />,
    )

    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('choose one')).toBeInTheDocument()

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
    const [mongoRadio, pgRadio] = radios as HTMLInputElement[]
    expect(mongoRadio.checked).toBe(true)
    expect(pgRadio.checked).toBe(false)

    fireEvent.click(pgRadio)
    expect(onToggle).toHaveBeenCalledWith('pg')
  })

  it('locks a mandatory ungrouped branch as an included, disabled row', () => {
    const onToggle = vi.fn()
    render(
      <BranchTree
        branches={[core, mongo, pg]}
        selected={new Set(['core', 'mongo'])}
        onToggle={onToggle}
      />,
    )

    expect(screen.getByText('Included')).toBeInTheDocument()
    const coreButton = screen.getByRole('button', { name: /node \+ express core/i })
    expect(coreButton).toBeDisabled()
  })

  it('keeps plain checkbox rows (no radios, no group header) for ungrouped branches', () => {
    const onToggle = vi.fn()
    const plain: MasterBranch[] = [
      { _id: 'b1', name: 'React + Tailwind', orderIndex: 0, topicCount: 10 },
    ]
    render(<BranchTree branches={plain} selected={new Set(['b1'])} onToggle={onToggle} />)

    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(screen.queryByText('choose one')).not.toBeInTheDocument()
    const row = screen.getByRole('button', { name: /react \+ tailwind/i })
    expect(row).toBeEnabled()
    fireEvent.click(row)
    expect(onToggle).toHaveBeenCalledWith('b1')
  })
})
