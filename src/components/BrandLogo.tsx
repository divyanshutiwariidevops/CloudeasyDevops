'use client'

import { useApp } from '../context/AppContext'

export function BrandLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  const { site } = useApp()
  return (
    <img
      src={site.logoUrl || '/logo.png'}
      alt={site.brandName || 'Cloudeasy Devops Portal'}
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: 8, display: 'block', objectFit: 'cover' }}
    />
  )
}
