import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from './providers'
import '@/styles/globals.css'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Starlinker - AI-First Service Marketplace',
  description: 'Book home services, buy products, and get AI-powered assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
