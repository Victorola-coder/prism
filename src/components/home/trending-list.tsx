"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { TrendingUp, ArrowRight } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"

interface TrendingAnalysis {
  id: string
  url: string
  pageTitle: string | null
  overallScore: number | null
  technologyCount: number
  analyzedAt: Date
}

interface TrendingListProps {
  analyses: TrendingAnalysis[]
  isDbData?: boolean
}

export function TrendingList({ analyses, isDbData = false }: TrendingListProps) {
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
          <h2 className="text-2xl font-bold text-[#fafafa]">
            {isDbData ? "Recent Analyses" : "Try These"}
          </h2>
        </div>
        {isDbData && (
          <button
            onClick={() => router.push("/history")}
            className="flex items-center gap-1 text-sm text-[#6366f1] transition-colors hover:text-[#5558e6]"
          >
            View all <ArrowRight size={14} />
          </button>
        )}
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {analyses.map((site, index) => {
          const score = site.overallScore ?? 75
          const scoreWidth = `${Math.max(score, 10)}%`

          return (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard
                className="cursor-pointer"
                onClick={() => {
                  if (site.id.startsWith("trending-")) {
                    router.push(`/analyze?url=${encodeURIComponent(site.url)}`)
                  } else {
                    router.push(`/report/${site.id}`)
                  }
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#fafafa]">
                    {site.pageTitle ?? site.url}
                  </span>
                  <Badge variant={isDbData ? "success" : "primary"}>
                    {isDbData ? "Analyzed" : "Trending"}
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-[#52525b]">{site.url}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/10 text-xs font-medium text-[#6366f1]">
                    {Math.round(score / 10)}
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-[#1f1f1f]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4]"
                        style={{ width: scoreWidth }}
                      />
                    </div>
                  </div>
                  {isDbData && (
                    <span className="shrink-0 text-xs text-[#52525b]">
                      {site.technologyCount} tech
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
