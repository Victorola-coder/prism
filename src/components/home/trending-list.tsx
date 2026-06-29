"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { TrendingUp, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { TRENDING_SITES } from "@/lib/constants"

export function TrendingList() {
  const router = useRouter()

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={20} className="text-[#6366f1]" />
          <h2 className="text-2xl font-bold text-[#fafafa]">Trending Analyses</h2>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#6366f1] transition-colors hover:text-[#5558e6]">
          View all <ArrowRight size={14} />
        </button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRENDING_SITES.map((site, index) => (
          <motion.div
            key={site.url}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <GlassCard
              className="cursor-pointer"
              onClick={() => router.push(`/analyze?url=${encodeURIComponent(site.url)}`)}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-[#fafafa]">{site.label}</span>
                <Badge variant="primary">Trending</Badge>
              </div>
              <p className="mb-4 text-sm text-[#52525b]">{site.url}</p>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1]/10 text-xs text-[#6366f1]">
                  A
                </div>
                <div className="flex-1">
                  <div className="h-1.5 rounded-full bg-[#1f1f1f]">
                    <div className="h-full w-10/12 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4]" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
