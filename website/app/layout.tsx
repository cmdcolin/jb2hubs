import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'jb2hubs',
  description: 'JBrowse 2 genome browser hubs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
