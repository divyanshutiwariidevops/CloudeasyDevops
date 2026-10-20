import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../index.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cloudeasy Devops Portal',
  description: 'Cloudeasy Devops Portal is an inventory management workspace made by Divyanshu Tiwari.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Cloudeasy Devops Portal',
  appleWebApp: {
    capable: true,
    title: 'Cloudeasy Devops Portal',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/cloudeasy-devops-favicon.png',
    shortcut: '/cloudeasy-devops-favicon.png',
    apple: '/cloudeasy-devops-favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b1220',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-bs-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
