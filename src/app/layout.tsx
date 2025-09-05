import { ReactNode } from 'react'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import './globals.css'

export const metadata = {
  title: 'Intelligent Task Planner',
  description: 'AI-powered task planning for university students',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-lavender-50 text-lavender-950 antialiased selection:bg-lavender-400 selection:text-white flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
