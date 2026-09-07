import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono, DM_Serif_Display } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' })

export const metadata: Metadata = {
  title: 'Adaeze Okafor | Class of 2026',
  description: 'An invitation to celebrate Adaeze Okafor, Faculty of Law, University of Lagos — signing out on 18 September 2026.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f6ef',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${dmSerif.variable} bg-background`}>
      <body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
