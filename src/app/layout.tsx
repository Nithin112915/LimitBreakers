import './globals.css'
import '../styles/theme.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Layout from '../components/Layout/Layout'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import UpdateNotification from '../components/UpdateNotification'
import APKUpdateNotification from '../components/APKUpdateNotification'
import MobileLayout from '../components/Layout/MobileLayout'

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
        <ErrorBoundary>
          <Providers>
            <ThemeProvider>
              <UpdateNotification />
              <APKUpdateNotification />
              <MobileLayout>
                <Layout>
                  {children}
                </Layout>
              </MobileLayout>
            </ThemeProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '10px',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
