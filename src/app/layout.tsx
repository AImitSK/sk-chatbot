import { getEvents } from '@/data'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import type React from 'react'
import { ApplicationLayout } from './application-layout'
import { AuthProvider } from '@/contexts/AuthContext'
import { BotpressProvider } from '@/contexts/BotpressContext'

export const metadata: Metadata = {
  title: {
    template: '%s - SK Online Marketing',
    default: 'SK Online Marketing',
  },
  description: 'SK Online Marketing Customer Portal',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let events = await getEvents()

  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <AuthProvider>
          <BotpressProvider>
            <ApplicationLayout events={events}>{children}</ApplicationLayout>
          </BotpressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
