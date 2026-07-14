import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import ActivityChart from '../activity-chart'
import type { ActivityResponse } from '../../types'

// jsdom never gives ResponsiveContainer a real measured width, so recharts
// would render nothing to assert on. Stub the pieces this component actually
// uses to verify the data wiring instead of pixel output.
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  // A real <svg> wrapper (not a <div>) so the component's own <defs>/
  // <linearGradient>/<stop> render as recognized SVG tags in jsdom.
  BarChart: ({ children, data }: { children: ReactNode; data: unknown[] }) => (
    <svg data-testid="bar-chart" data-row-count={data.length}>
      {children}
    </svg>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => <div data-testid="bar" data-key={dataKey} />,
  XAxis: () => null,
  Tooltip: () => null,
}))

const activeData: ActivityResponse = {
  days: 3,
  baseline: 2,
  series: [
    { date: '2026-07-10', count: 1 },
    { date: '2026-07-11', count: 0 },
    { date: '2026-07-12', count: 2 },
  ],
}

const emptyData: ActivityResponse = {
  days: 3,
  baseline: 0,
  series: [
    { date: '2026-07-10', count: 0 },
    { date: '2026-07-11', count: 0 },
    { date: '2026-07-12', count: 0 },
  ],
}

describe('ActivityChart', () => {
  it('renders the count bars and the cumulative-total KPI given data', () => {
    render(<ActivityChart data={activeData} />)
    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-row-count', '3')
    expect(screen.getByTestId('bar')).toHaveAttribute('data-key', 'count')
    // baseline 2 + counts (1 + 0 + 2) = 5
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/sections completed total/i)).toBeInTheDocument()
  })

  it('shows the empty-state message when there is no activity at all', () => {
    render(<ActivityChart data={emptyData} />)
    expect(screen.getByText(/no activity yet/i)).toBeInTheDocument()
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument()
  })
})
