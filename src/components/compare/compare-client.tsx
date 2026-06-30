"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { formatUrl } from "@/lib/utils"

export function CompareClient() {
  const router = useRouter()
  const [urlA, setUrlA] = useState("")
  const [urlB, setUrlB] = useState("")

  const handleCompare = () => {
    if (!urlA.trim() || !urlB.trim()) return
    const a = formatUrl(urlA.trim())
    router.push(`/analyze?url=${encodeURIComponent(a)}`)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold">
            <GradientText variant="primary">Compare Websites</GradientText>
          </h1>
          <p className="mx-auto max-w-lg text-[#a1a1aa]">
            Analyze two websites side by side and compare their technology stacks, performance, and design.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex-1">
                <p className="mb-2 text-xs font-medium text-[#52525b]">WEBSITE A</p>
                <Input
                  type="url"
                  placeholder="Paste first URL..."
                  value={urlA}
                  onChange={(e) => setUrlA(e.target.value)}
                />
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1f1f1f] bg-[#121212]">
                <Plus size={16} className="text-[#6366f1]" />
              </div>
              <div className="flex-1">
                <p className="mb-2 text-xs font-medium text-[#52525b]">WEBSITE B</p>
                <Input
                  type="url"
                  placeholder="Paste second URL..."
                  value={urlB}
                  onChange={(e) => setUrlB(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleCompare}
                disabled={!urlA.trim() || !urlB.trim()}
              >
                Compare
                <ArrowRight size={16} />
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#52525b]">
            Compare any two websites — detect differences in frameworks, hosting, performance, and more.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
