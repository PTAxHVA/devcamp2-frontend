import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RoadmapSnakePath from '../snake-roadmap'
import type { LearningTopic } from '../../types'

// Completion is section-progress based, so `done` sets both the status and the
// section counts to keep test data internally consistent with the real app.
function topic(over: Partial<LearningTopic> & { done?: boolean }): LearningTopic {
  const { done, ...rest } = over
  return {
    masterTopicId: 't',
    userTopicId: null,
    title: 'Topic',
    status: done ? 'completed' : 'available',
    orderIndex: 0,
    estimatedHours: 1,
    sectionTotal: 2,
    sectionCompleted: done ? 2 : 0,
    prerequisiteTopicIds: [],
    ...rest,
  }
}

describe('RoadmapSnakePath — FINISH node', () => {
  it('fires onFinish when every topic is completed', () => {
    const onFinish = vi.fn()
    render(
      <RoadmapSnakePath
        topics={[
          topic({ masterTopicId: 'a', title: 'A', done: true }),
          topic({ masterTopicId: 'b', title: 'B', done: true }),
        ]}
        activeTopicId={undefined}
        onNodeClick={vi.fn()}
        onFinish={onFinish}
      />,
    )

    fireEvent.click(screen.getByText('FINISH'))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('activates FINISH with the keyboard (Enter) when complete', () => {
    const onFinish = vi.fn()
    render(
      <RoadmapSnakePath
        topics={[topic({ masterTopicId: 'a', title: 'A', done: true })]}
        activeTopicId={undefined}
        onNodeClick={vi.fn()}
        onFinish={onFinish}
      />,
    )

    fireEvent.keyDown(screen.getByText('FINISH'), { key: 'Enter' })
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('does not fire onFinish while a topic is unfinished (FINISH stays locked)', () => {
    const onFinish = vi.fn()
    render(
      <RoadmapSnakePath
        topics={[
          topic({ masterTopicId: 'a', title: 'A', done: true }),
          topic({ masterTopicId: 'b', title: 'B', status: 'in_progress', sectionCompleted: 1 }),
        ]}
        activeTopicId={undefined}
        onNodeClick={vi.fn()}
        onFinish={onFinish}
      />,
    )

    fireEvent.click(screen.getByText('FINISH'))
    expect(onFinish).not.toHaveBeenCalled()
  })

  it('still fires onNodeClick when a topic node is clicked', () => {
    const onNodeClick = vi.fn()
    render(
      <RoadmapSnakePath
        topics={[topic({ masterTopicId: 'a', title: 'Alpha' })]}
        activeTopicId={undefined}
        onNodeClick={onNodeClick}
        onFinish={vi.fn()}
      />,
    )

    // Label + tooltip both carry "1. Alpha"; either bubbles to the node's onClick.
    fireEvent.click(screen.getAllByText('1. Alpha')[0])
    expect(onNodeClick).toHaveBeenCalledWith(expect.objectContaining({ masterTopicId: 'a' }))
  })
})
