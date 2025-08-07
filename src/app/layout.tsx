import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navigation } from '../components/Layout/Navigation'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Limit Breakers - AI-Driven Personal Growth Platform',
  description: 'Empower your personal growth with AI-driven habit tracking, accountability, and professional networking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
            <Toaster position="top-right" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
