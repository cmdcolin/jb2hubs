import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JBrowse UCSC GenArk hubs',
  description: 'All the genomes!',
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
