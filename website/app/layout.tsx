import { NuqsAdapter } from 'nuqs/adapters/next/app'

import type { Metadata } from 'next'

import './globals.css'

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
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
