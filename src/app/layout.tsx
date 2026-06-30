import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Prism — X-ray vision for the internet",
    template: "%s — Prism",
  },
  description:
    "Instantly understand how any website is built. Framework, hosting, performance, design, and more.",
  openGraph: {
    title: "Prism — X-ray vision for the internet",
    description: "Instantly understand how any website is built.",
    siteName: "Prism",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prism — X-ray vision for the internet",
    description: "Instantly understand how any website is built.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#0a0a0a] font-sans antialiased">
        <ErrorBoundary>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
