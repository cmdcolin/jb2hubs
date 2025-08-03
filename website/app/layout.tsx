import { Roboto } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Header from './components/Header.tsx'

import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'JBrowse 2 genome browser hubs',
  description: 'JBrowse 2 genome browser hubs',
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
