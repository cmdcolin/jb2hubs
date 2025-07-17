import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { createJBrowseTheme } from '@jbrowse/core/ui/theme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

import Header from './components/Header.tsx'

import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from '@mui/material'

export const metadata: Metadata = {
  title: 'JBrowse 2 hubs',
  description: 'JBrowse 2 genome browser hubs',
  icons: {
    icon: [
      {
        url: '/demos/jb2hubs/favicon.svg',
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
        <AppRouterCacheProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline
            to build upon. */}
          <NuqsAdapter>
            <Header />
            {children}
          </NuqsAdapter>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
