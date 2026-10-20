import type { Metadata } from 'next'
import { Landing } from '../views/Landing'

export const metadata: Metadata = {
  title: 'Cloudeasy Devops Portal',
  description: 'Public landing page and blog for Cloudeasy Devops Portal.',
}

export default function HomePage() {
  return <Landing />
}
