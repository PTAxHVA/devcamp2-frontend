import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { GapTopicList } from '../gap-topic-list'
import type { GapTopicItem } from '../../types'

const topic = (topicId: string, name: string, estimatedHours = 2): GapTopicItem => ({
  topicId,
  name,
  estimatedHours,
})

describe('GapTopicList', () => {
  it('renders the three gap groups with their topics', () => {
    render(
      <GapTopicList
        verified={[topic('t1', 'HTML')]}
        inProgress={[topic('t2', 'CSS')]}
        missing={[topic('t3', 'React'), topic('t4', 'Node.js & Express', 3)]}
      />,
    )

    const groupOf = (title: string) => {
      const heading = screen.getByRole('heading', { name: new RegExp(title, 'i') })
      return within(heading.closest('div[class*="rounded-3xl"]') as HTMLElement)
    }

    expect(groupOf('Verified').getByText('HTML')).toBeInTheDocument()
    expect(groupOf('In progress').getByText('CSS')).toBeInTheDocument()
    expect(groupOf('Missing').getByText('React')).toBeInTheDocument()
    expect(groupOf('Missing').getByText('Node.js & Express')).toBeInTheDocument()
    expect(groupOf('Missing').getByText('~3h')).toBeInTheDocument()
  })

  it('shows an empty note for a group with no topics', () => {
    render(<GapTopicList verified={[]} inProgress={[]} missing={[topic('t3', 'React')]} />)
    expect(screen.getByText(/Nothing verified for this role yet/i)).toBeInTheDocument()
    expect(screen.getByText(/No topics started for this role yet/i)).toBeInTheDocument()
  })
})
