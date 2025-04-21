import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type React from "react";
import "./globals.css";
import { PWARegister } from "./pwa";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "English Tutor - Improve Your Speaking Skills",
  description: "Practice English conversations with AI-powered feedback",
  manifest: "/manifest.json",
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
      url: "github.com/ikbal-nayem",
    },
  ],
  keywords: [
    "English Tutor",
    "Speaking Practice",
    "AI Conversation",
    "Language Learning",
    "English Improvement",
    "Grammar Feedback",
  ],
  creator: "Ikbal Nayem",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4F46E5",
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <PWARegister />
          <NextTopLoader color="#4f46e5" height={2} shadow="0 0 10px #4f46e5,0 0 5px #4f46e5" showSpinner={false} />
          <div className="min-h-screen bg-gradient-to-b from-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 light:from-white light:via-gray-50 light:to-white text-gray-900 dark:text-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <div className="container mx-auto px-4 py-4 max-w-4xl">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
