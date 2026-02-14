import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'Your AI Study Co-Pilot',
  description: 'Sign in to your AI-powered study companion',
}

export const viewport: Viewport = {
  themeColor: '#e8f5e9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_spaceMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
