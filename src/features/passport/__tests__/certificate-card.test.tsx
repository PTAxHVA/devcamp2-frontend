import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CertificateCard } from '../components/certificate-card'

describe('CertificateCard print targeting', () => {
  it('is the print target by default (single-certificate pages)', () => {
    const { container } = render(
      <CertificateCard username="thai-dev" roleName="Backend Web Developer" topicsCount={9} />,
    )
    expect(container.querySelector('.certificate-print-area.print-target')).not.toBeNull()
  })

  it('drops the print-target class when not selected (multi-certificate lists)', () => {
    const { container } = render(
      <CertificateCard
        username="thai-dev"
        roleName="Backend Web Developer"
        topicsCount={9}
        printTarget={false}
      />,
    )
    expect(container.querySelector('.certificate-print-area')).not.toBeNull()
    expect(container.querySelector('.print-target')).toBeNull()
  })
})
