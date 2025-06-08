import { NuqsAdapter } from 'nuqs/adapters/next/app'

import type { Metadata } from 'next'

import './globals.css'
import Header from './components/Header'

export const metadata: Metadata = {
  title: 'jb2hubs',
  description: 'JBrowse 2 genome browser hubs',
  icons: {
    icon: [
      {
        url: '/jb2hubs/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <Header />
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
