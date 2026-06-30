"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/compare", label: "Compare" },
  { href: "/history", label: "History" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-[#1f1f1f]" />
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#06b6d4]">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-lg font-semibold text-[#fafafa]">Prism</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="primary" size="sm" asChild>
            <Link href="/analyze">New Analysis</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 p-2 text-[#a1a1aa] hover:text-[#fafafa] md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-16 border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm text-[#a1a1aa] transition-colors hover:bg-[#121212] hover:text-[#fafafa]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="primary" size="sm" asChild className="mt-2">
                <Link href="/analyze" onClick={() => setIsOpen(false)}>
                  New Analysis
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
