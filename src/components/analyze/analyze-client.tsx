"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"
const STEPS = [
  "Connecting...",
  "Detecting technologies...",
  "Analyzing CSS architecture...",
  "Inspecting JavaScript frameworks...",
  "Running Lighthouse audit...",
  "Finding fonts and typography...",
  "Extracting color palette...",
  "Understanding architecture...",
  "Mapping design system...",
  "Checking performance metrics...",
  "Generating AI insights...",
  "Building your report...",
]

export function AnalyzeClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get("url")
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!url) {
      router.push("/")
      return
    }
  }, [url, router])

  useEffect(() => {
    if (!url) return

    const totalDuration = 8000
    const steps = STEPS.length
    const interval = totalDuration / steps

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps - 1) return prev + 1
        clearInterval(stepTimer)
        return prev
      })
    }, interval)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressTimer)
          return 95
        }
        return prev + 1
      })
    }, totalDuration / 100)

    const completeTimer = setTimeout(() => {
      setProgress(100)
      setIsComplete(true)
      setTimeout(() => {
        router.push(`/report/demo?url=${encodeURIComponent(url!)}`)
      }, 500)
    }, totalDuration + 1000)

    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
      clearTimeout(completeTimer)
    }
  }, [url, router])

  if (!url) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#6366f1]/20 blur-xl" />
              <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-2 border-transparent border-t-[#6366f1] border-r-[#06b6d4]" />
                <div className="absolute inset-2 animate-[spin_4s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-[#6366f1] border-l-[#06b6d4]" />
                <Loader2 size={32} className="animate-spin text-[#6366f1]" />
              </div>
            </div>

            <div className="text-center">
              <p className="mb-1 text-lg text-[#a1a1aa]">Analyzing</p>
              <p className="max-w-sm truncate text-sm text-[#52525b]">{url}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-[#6366f1]"
                >
                  {STEPS[currentStep]}
                </motion.p>
              </AnimatePresence>
              <div className="h-1 w-64 overflow-hidden rounded-full bg-[#1f1f1f] sm:w-96">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4]"
                  style={{ width: `${progress}%` }}
                  layout
                />
              </div>
              <p className="text-xs text-[#52525b]">{progress}%</p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: currentStep > i * 3 ? 1 : 0.3,
                    scale: 1,
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-[#121212] px-3 py-1"
                >
                  {currentStep > i * 3 ? (
                    <CheckCircle2 size={12} className="text-[#10b981]" />
                  ) : (
                    <Sparkles size={12} className="text-[#52525b]" />
                  )}
                  <span className="text-xs text-[#a1a1aa]">
                    {["Stack", "Design", "Performance", "AI"][i]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#10b981]/10">
              <CheckCircle2 size={40} className="text-[#10b981]" />
            </div>
            <p className="text-xl font-semibold text-[#fafafa]">Analysis Complete!</p>
            <p className="text-sm text-[#a1a1aa]">Preparing your report...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
