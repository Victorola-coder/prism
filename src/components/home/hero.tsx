"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GradientText } from "@/components/shared/gradient-text"
import { formatUrl } from "@/lib/utils"
import { TRENDING_SITES } from "@/lib/constants"

export function Hero() {
  const router = useRouter()
  const [url, setUrl] = useState("")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!url.trim()) return
      const formatted = formatUrl(url.trim())
      router.push(`/analyze?url=${encodeURIComponent(formatted)}`)
    },
    [url, router],
  )

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1]/5 blur-[120px]" />
        <div className="absolute left-1/2 top-3/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06b6d4]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#1f1f1f] bg-[#121212] px-4 py-1.5"
        >
          <Sparkles size={14} className="text-[#6366f1]" />
          <span className="text-sm text-[#a1a1aa]">
            X-ray vision for the internet
          </span>
        </motion.div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <GradientText>
            What powers your
          </GradientText>
          <br />
          <GradientText variant="primary">
            favorite websites?
          </GradientText>
        </h1>

        <p className="max-w-xl text-lg text-[#a1a1aa] sm:text-xl">
          Paste any URL and get a beautiful, interactive report — framework, hosting, performance, design, and more.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row"
        >
          <div className="relative flex-1 w-full">
            <Input
              type="url"
              placeholder="Paste any URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-14 w-full pl-5 pr-4 text-base shadow-[0_0_30px_rgba(99,102,241,0.05)]"
            />
          </div>
          <Button
            type="submit"
            size="xl"
            className="w-full shrink-0 sm:w-auto"
            disabled={!url.trim()}
          >
            Analyze
            <ArrowRight size={18} />
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-[#52525b]">Try:</span>
          {TRENDING_SITES.map((site) => (
            <button
              key={site.url}
              onClick={() => router.push(`/analyze?url=${encodeURIComponent(site.url)}`)}
              className="rounded-full border border-[#1f1f1f] px-3 py-1 text-sm text-[#a1a1aa] transition-all duration-200 hover:border-[#6366f1] hover:text-[#fafafa]"
            >
              {site.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-12 w-6 rounded-full border-2 border-[#1f1f1f]">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-2 h-2 w-1 rounded-full bg-[#6366f1]"
          />
        </div>
      </motion.div>
    </section>
  )
}
