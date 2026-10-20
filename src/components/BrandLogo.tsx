'use client'

import { useApp } from '../context/AppContext'

const MARK = '/cloudeasy-devops-favicon.png'
const WORDMARK = '/cloudeasy-devops-logo.png'

export function BrandLogo({
  size = 32,
  className = '',
  variant = 'mark',
}: {
  size?: number
  className?: string
  variant?: 'mark' | 'wordmark'
}) {
  const { site } = useApp()
  const wordmark = variant === 'wordmark' && !site.logoUrl
  return (
    <img
      src={site.logoUrl || (wordmark ? WORDMARK : MARK)}
      alt={site.brandName || 'Cloudeasy Devops Portal'}
      width={wordmark ? Math.round(size * 3.4) : size}
      height={size}
      className={className}
      style={{
        display: 'block',
        objectFit: 'contain',
        width: wordmark ? 'auto' : size,
        height: size,
        maxWidth: wordmark ? '100%' : undefined,
        borderRadius: wordmark ? 0 : 8,
      }}
    />
  )
}
