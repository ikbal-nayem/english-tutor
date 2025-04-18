import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Home, MessageSquare, Mic } from "lucide-react"
import { PWARegister } from "./pwa"
import Image from "next/image"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "English Tutor - Improve Your Speaking Skills",
  description: "Practice English conversations with AI-powered feedback",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "English Tutor",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  authors: [
    {
      name: "Ikbal Nayem",
    },
  ],
  creator: "Ikbal Nayem",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <PWARegister />
          <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 light:from-white light:via-gray-50 light:to-white text-white dark:text-gray-100 light:text-gray-900 flex flex-col">
            <nav className="bg-black/20 dark:bg-black/10 light:bg-white backdrop-blur-sm border-b border-white/10 dark:border-gray-800 light:border-gray-200 sticky top-0 z-10">
              <div className="container mx-auto px-4 py-2 max-w-4xl flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/logo.png" alt="English Tutor Logo" width={32} height={32} className="mr-2" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    English Tutor
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <NavLink href="/" icon={<Home className="h-4 w-4" />} label="Home" />
                  <NavLink href="/practice" icon={<Mic className="h-4 w-4" />} label="Practice" />
                  <NavLink href="/scenarios" icon={<MessageSquare className="h-4 w-4" />} label="Scenarios" />
                  <ThemeToggle />
                </div>
              </div>
            </nav>
            <main className="flex-1">
              <div className="container mx-auto px-4 py-4 max-w-4xl">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-white/10 dark:hover:bg-gray-700/50 light:hover:bg-gray-100 transition-colors text-white dark:text-gray-200 light:text-gray-800"
    >
      <span className="mr-1.5">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
