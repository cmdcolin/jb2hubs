import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Roboto } from 'next/font/google'

import Header from './components/Header.tsx'

import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'JBrowse 2 genome browser hubs',
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

const roboto = Roboto({
  subsets: ['latin'],
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <NuqsAdapter>
          <Header />
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
