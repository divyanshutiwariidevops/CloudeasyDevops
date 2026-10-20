'use client'

import { useApp } from '../context/AppContext'

export function SiteName() {
  const { site } = useApp()
  return <>{site.brandName}</>
}
