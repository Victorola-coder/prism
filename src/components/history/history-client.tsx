"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { History, ArrowRight, Search, Loader2 } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GradientText } from "@/components/shared/gradient-text"
import { extractDomain } from "@/lib/utils"

interface HistoryAnalysis {
  id: string
  url: string
  pageTitle: string | null
  overallScore: number | null
  status: string
  technologyCount: number
  analyzedAt: Date
}

interface HistoryClientProps {
  analyses: HistoryAnalysis[]
}

const PAGE_SIZE = 12

export function HistoryClient({ analyses }: HistoryClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!search.trim()) return analyses
    const q = search.toLowerCase()
    return analyses.filter(
      (a) =>
        (a.pageTitle?.toLowerCase() ?? "").includes(q) ||
        a.url.toLowerCase().includes(q) ||
        extractDomain(a.url).toLowerCase().includes(q),
    )
  }, [analyses, search])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = paged.length < filtered.length

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/10">
              <History size={24} className="text-[#6366f1]" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">
            <GradientText variant="primary">Analysis History</GradientText>
          </h1>
          <p className="mx-auto max-w-lg text-[#a1a1aa]">
            Browse all your past website analyses and revisit reports.
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="relative mx-auto max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <Input
              placeholder="Search by URL or title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="pl-9"
            />
          </div>
        </div>

        {analyses.length > 0 ? (
          <>
            <p className="mb-4 text-xs text-[#52525b]">
              {filtered.length === analyses.length
                ? `${analyses.length} analysis${analyses.length === 1 ? "" : "ies"}`
                : `${filtered.length} of ${analyses.length} analysis${analyses.length === 1 ? "" : "ies"}`}
            </p>
            <div className="space-y-3">
              {paged.map((analysis, index) => {
                const score = analysis.overallScore ?? 0

                return (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <GlassCard
                      className="flex cursor-pointer items-center gap-4 transition-all hover:border-[#6366f1]/30"
                      onClick={() => router.push(`/report/${analysis.id}`)}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366f1]/10">
                        <span className="text-lg font-bold text-[#6366f1]">
                          {Math.round(score / 10)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#fafafa]">
                          {analysis.pageTitle ?? analysis.url}
                        </p>
                        <p className="truncate text-xs text-[#52525b]">{analysis.url}</p>
                      </div>

                      <div className="hidden items-center gap-4 sm:flex">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-20 rounded-full bg-[#1f1f1f]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4]"
                                style={{ width: `${Math.max(score, 5)}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#a1a1aa]">{score}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-[#52525b]">
                            {analysis.technologyCount} technologies
                          </p>
                        </div>
                        <Badge variant={score >= 80 ? "success" : score >= 50 ? "warning" : "error"}>
                          {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs work"}
                        </Badge>
                      </div>

                      <ArrowRight size={16} className="shrink-0 text-[#52525b]" />
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => setPage((p) => p + 1)}
                >
                  <Loader2 size={16} />
                  Load More ({filtered.length - paged.length} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="py-16 text-center">
              <History size={40} className="mx-auto mb-4 text-[#52525b]" />
              <p className="mb-2 text-lg font-medium text-[#fafafa]">No analyses yet</p>
              <p className="mb-6 text-sm text-[#52525b]">
                {search.trim()
                  ? "No analyses match your search."
                  : "Paste a URL to analyze your first website"}
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5558e6]"
              >
                {search.trim() ? "Clear search" : "Analyze a website"}
                <ArrowRight size={16} />
              </button>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
