"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Globe,
  BarChart3,
  Eye,
  Search,
  CheckCircle2 as CheckIcon,
  AlertTriangle,
  Sparkles,
  GitCompare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientText } from "@/components/shared/gradient-text"
import { ScoreRing } from "@/components/shared/score-ring"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn, formatUrl, extractDomain } from "@/lib/utils"

interface Technology {
  name: string
  category: string
  version: string | null
  icon: string | null
  confidence: number
}

interface Lighthouse {
  performance: number | null
  accessibility: number | null
  seo: number | null
  bestPractices: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
}

interface FontInfo {
  family: string
  category: string
  variants: number
}

interface Colors {
  primary: string
  secondary: string | null
  accent: string | null
  background: string | null
  text: string | null
  palette: unknown
}

interface DesignSystem {
  hasDesignSystem: boolean
  framework: string | null
  components: number | null
  tokens: unknown
}

interface AiSummary {
  summary: string
  insights: unknown
}

interface Architecture {
  type: string | null
  hosting: string | null
  cdn: string | null
  diagram: unknown
}

interface AnalysisData {
  id: string
  url: string
  status: string
  pageTitle: string | null
  screenshotUrl: string | null
  overallScore: number | null
  error: string | null
  technologies: Technology[]
  lighthouse: Lighthouse | null
  fonts: FontInfo[]
  colors: Colors | null
  designSystem: DesignSystem | null
  aiSummary: AiSummary | null
  architecture: Architecture | null
}

type AnalysisPhase = "form" | "analyzing" | "results"

interface AnalysisState {
  id: string | null
  url: string
  status: "pending" | "analyzing" | "completed" | "error"
  error: string | null
  data: AnalysisData | null
  overallScore: number | null
  pageTitle: string | null
}

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
  "Building comparison...",
]

function TechRow({
  name,
  category,
  version,
  presentA,
  presentB,
}: {
  name: string
  category: string
  version: string | null
  presentA: boolean
  presentB: boolean
}) {
  const shared = presentA && presentB
  const aOnly = presentA && !presentB
  const bOnly = !presentA && presentB

  let badgeVariantA: "success" | "primary" | "default" = "default"
  let badgeVariantB: "success" | "primary" | "default" = "default"

  if (shared) {
    badgeVariantA = "success"
    badgeVariantB = "success"
  } else if (aOnly) {
    badgeVariantA = "primary"
  } else if (bOnly) {
    badgeVariantB = "primary"
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1f1f1f] bg-[#121212] px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#fafafa]">{name}</p>
        <p className="text-xs text-[#52525b]">{category}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant={badgeVariantA}
          className={cn(
            "w-20 justify-center",
            !presentA && "opacity-30",
          )}
        >
          {presentA ? (version ?? "Detected") : "—"}
        </Badge>
        <span className="text-xs text-[#52525b]">vs</span>
        <Badge
          variant={badgeVariantB}
          className={cn(
            "w-20 justify-center",
            !presentB && "opacity-30",
          )}
        >
          {presentB ? (version ?? "Detected") : "—"}
        </Badge>
      </div>
    </div>
  )
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-[#fafafa]">{title}</h3>
      {count !== undefined && (
        <p className="text-sm text-[#52525b]">{count} technologies detected</p>
      )}
    </div>
  )
}

function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  const color = value >= 90 ? "#10b981" : value >= 70 ? "#eab308" : value >= 50 ? "#f97316" : "#ef4444"
  return (
    <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-[#52525b]">{label}</p>
        <span className="text-sm font-medium" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#1f1f1f]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function ScoreCards({
  analysis,
  label,
}: {
  analysis: AnalysisData
  label: string
}) {
  const score = analysis.overallScore ?? 0
  const lighthouse = analysis.lighthouse

  return (
    <div className="grid grid-cols-2 gap-3">
      <GlassCard className="flex flex-col items-center py-4" hover={false}>
        <ScoreRing score={score} size={64} label={label} />
      </GlassCard>
      {lighthouse ? (
        <>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={lighthouse.performance ?? 0} size={64} label="Perf" />
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={lighthouse.accessibility ?? 0} size={64} label="A11y" />
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={lighthouse.seo ?? 0} size={64} label="SEO" />
          </GlassCard>
        </>
      ) : (
        <>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={Math.round(score * 0.95)} size={64} label="Perf" />
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={Math.round(score * 0.85)} size={64} label="A11y" />
          </GlassCard>
          <GlassCard className="flex flex-col items-center py-4" hover={false}>
            <ScoreRing score={Math.round(score * 0.92)} size={64} label="SEO" />
          </GlassCard>
        </>
      )}
    </div>
  )
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="h-6 w-6 rounded border border-[#1f1f1f]"
      style={{ backgroundColor: color }}
      title={color}
    />
  )
}

function TechSection({
  a,
  b,
}: {
  a: AnalysisData
  b: AnalysisData
}) {
  const aNames = new Set(a.technologies.map((t) => t.name))
  const bNames = new Set(b.technologies.map((t) => t.name))
  const allNames = new Set([...aNames, ...bNames])

  const shared: Technology[] = []
  const aOnly: Technology[] = []
  const bOnly: Technology[] = []

  for (const name of allNames) {
    const inA = a.technologies.find((t) => t.name === name)
    const inB = b.technologies.find((t) => t.name === name)
    if (inA && inB) shared.push(inA)
    else if (inA && !inB) aOnly.push(inA)
    else if (!inA && inB) bOnly.push(inB!)
  }

  const allTech = [...shared, ...aOnly, ...bOnly]

  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-wrap gap-3">
        <Badge variant="success">Shared ({shared.length})</Badge>
        <Badge variant="primary">Only in A ({aOnly.length})</Badge>
        <Badge variant="accent">Only in B ({bOnly.length})</Badge>
      </div>
      <div className="space-y-2">
        {allTech.map((tech) => (
          <TechRow
            key={tech.name}
            name={tech.name}
            category={tech.category}
            version={tech.version}
            presentA={aNames.has(tech.name)}
            presentB={bNames.has(tech.name)}
          />
        ))}
      </div>
      {allTech.length === 0 && (
        <p className="py-8 text-center text-sm text-[#52525b]">No technologies detected</p>
      )}
    </div>
  )
}

function PerformanceSection({
  a,
  b,
}: {
  a: AnalysisData
  b: AnalysisData
}) {
  const metricsA = a.lighthouse
  const metricsB = b.lighthouse

  const renderWebVitals = (prefix: string, lighthouse: Lighthouse | null) => {
    if (!lighthouse) return null
    const items: { label: string; value: number | null; unit: string; good: number; warn: number }[] = [
      { label: "LCP", value: lighthouse.lcp, unit: "s", good: 2500, warn: 4000 },
      { label: "FID", value: lighthouse.fid, unit: "ms", good: 100, warn: 300 },
      { label: "CLS", value: lighthouse.cls, unit: "", good: 0.1, warn: 0.25 },
    ]
    return items.map((item) => {
      if (item.value === null || item.value === undefined) return null
      const isGood = item.value < item.good
      const isWarn = !isGood && item.value < item.warn
      const Icon = isGood ? CheckIcon : isWarn ? AlertTriangle : XCircle
      const iconColor = isGood ? "text-[#10b981]" : isWarn ? "text-[#eab308]" : "text-[#ef4444]"
      const display = item.unit === "s" ? (item.value / 1000).toFixed(1) : item.unit === "ms" ? Math.round(item.value).toString() : item.value.toFixed(2)
      return (
        <div key={item.label} className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs text-[#52525b]">{item.label}</p>
            <Icon size={12} className={iconColor} />
          </div>
          <p className="text-lg font-bold text-[#fafafa]">
            {display}
            {item.unit && <span className="ml-0.5 text-xs text-[#52525b]">{item.unit}</span>}
          </p>
        </div>
      )
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site A</p>
        <div className="space-y-2">
          {metricsA ? (
            <>
              <MetricBar label="Performance" value={metricsA.performance ?? 0} />
              <MetricBar label="Accessibility" value={metricsA.accessibility ?? 0} />
              <MetricBar label="SEO" value={metricsA.seo ?? 0} />
              <MetricBar label="Best Practices" value={metricsA.bestPractices ?? 0} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {renderWebVitals("a", metricsA)}
              </div>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-[#52525b]">No performance data</p>
          )}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site B</p>
        <div className="space-y-2">
          {metricsB ? (
            <>
              <MetricBar label="Performance" value={metricsB.performance ?? 0} />
              <MetricBar label="Accessibility" value={metricsB.accessibility ?? 0} />
              <MetricBar label="SEO" value={metricsB.seo ?? 0} />
              <MetricBar label="Best Practices" value={metricsB.bestPractices ?? 0} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {renderWebVitals("b", metricsB)}
              </div>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-[#52525b]">No performance data</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DesignSection({
  a,
  b,
}: {
  a: AnalysisData
  b: AnalysisData
}) {
  const paletteA = a.colors?.palette
  const paletteArrayA: string[] = Array.isArray(paletteA) ? paletteA : typeof paletteA === "object" && paletteA ? Object.values(paletteA as Record<string, string>) : []
  const paletteB = b.colors?.palette
  const paletteArrayB: string[] = Array.isArray(paletteB) ? paletteB : typeof paletteB === "object" && paletteB ? Object.values(paletteB as Record<string, string>) : []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site A</p>
        {paletteArrayA.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs text-[#52525b]">COLORS</p>
            <div className="flex flex-wrap gap-2">
              {paletteArrayA.map((c) => (
                <ColorSwatch key={c} color={c} />
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs text-[#52525b]">TYPOGRAPHY</p>
          <div className="space-y-2">
            {a.fonts.length > 0 ? (
              a.fonts.map((f) => (
                <div key={f.family} className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-3">
                  <p className="text-sm text-[#fafafa]">{f.family}</p>
                  <p className="text-xs text-[#52525b]">{f.category} · {f.variants} variants</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#52525b]">No fonts detected</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site B</p>
        {paletteArrayB.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 text-xs text-[#52525b]">COLORS</p>
            <div className="flex flex-wrap gap-2">
              {paletteArrayB.map((c) => (
                <ColorSwatch key={c} color={c} />
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs text-[#52525b]">TYPOGRAPHY</p>
          <div className="space-y-2">
            {b.fonts.length > 0 ? (
              b.fonts.map((f) => (
                <div key={f.family} className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-3">
                  <p className="text-sm text-[#fafafa]">{f.family}</p>
                  <p className="text-xs text-[#52525b]">{f.category} · {f.variants} variants</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#52525b]">No fonts detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArchitectureSection({
  a,
  b,
}: {
  a: AnalysisData
  b: AnalysisData
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site A</p>
        <div className="space-y-3">
          {a.architecture?.type && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">FRAMEWORK</p>
              <p className="text-sm font-medium text-[#fafafa]">{a.architecture.type}</p>
            </div>
          )}
          {a.architecture?.hosting && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">HOSTING</p>
              <p className="text-sm font-medium text-[#fafafa]">{a.architecture.hosting}</p>
            </div>
          )}
          {a.architecture?.cdn && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">CDN</p>
              <p className="text-sm font-medium text-[#fafafa]">{a.architecture.cdn}</p>
            </div>
          )}
          {!a.architecture?.type && !a.architecture?.hosting && !a.architecture?.cdn && (
            <p className="py-6 text-center text-sm text-[#52525b]">No architecture data</p>
          )}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-medium text-[#fafafa]">Site B</p>
        <div className="space-y-3">
          {b.architecture?.type && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">FRAMEWORK</p>
              <p className="text-sm font-medium text-[#fafafa]">{b.architecture.type}</p>
            </div>
          )}
          {b.architecture?.hosting && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">HOSTING</p>
              <p className="text-sm font-medium text-[#fafafa]">{b.architecture.hosting}</p>
            </div>
          )}
          {b.architecture?.cdn && (
            <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-xs text-[#52525b]">CDN</p>
              <p className="text-sm font-medium text-[#fafafa]">{b.architecture.cdn}</p>
            </div>
          )}
          {!b.architecture?.type && !b.architecture?.hosting && !b.architecture?.cdn && (
            <p className="py-6 text-center text-sm text-[#52525b]">No architecture data</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function CompareClient() {
  const [phase, setPhase] = useState<AnalysisPhase>("form")
  const [urlA, setUrlA] = useState("")
  const [urlB, setUrlB] = useState("")
  const [siteA, setSiteA] = useState<AnalysisState>({
    id: null,
    url: "",
    status: "pending",
    error: null,
    data: null,
    overallScore: null,
    pageTitle: null,
  })
  const [siteB, setSiteB] = useState<AnalysisState>({
    id: null,
    url: "",
    status: "pending",
    error: null,
    data: null,
    overallScore: null,
    pageTitle: null,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const pollRefA = useRef<ReturnType<typeof setInterval>>(undefined)
  const pollRefB = useRef<ReturnType<typeof setInterval>>(undefined)
  const startedRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (pollRefA.current) clearInterval(pollRefA.current)
      if (pollRefB.current) clearInterval(pollRefB.current)
    }
  }, [])

  const cleanupPolling = useCallback(() => {
    if (pollRefA.current) {
      clearInterval(pollRefA.current)
      pollRefA.current = undefined
    }
    if (pollRefB.current) {
      clearInterval(pollRefB.current)
      pollRefB.current = undefined
    }
  }, [])

  const fetchFullReport = useCallback(async (id: string): Promise<AnalysisData | null> => {
    try {
      const res = await fetch(`/api/report/${id}`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }, [])

  const startPolling = useCallback((id: string, side: "a" | "b") => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/analyze/status/${id}`)
        if (!res.ok) return
        const data = await res.json()

        if (!mountedRef.current) return

        if (data.status === "completed") {
          if (side === "a") {
            if (pollRefA.current) clearInterval(pollRefA.current)
            pollRefA.current = undefined
            const full = await fetchFullReport(id)
            if (mountedRef.current) {
              setSiteA((prev) => ({
                ...prev,
                status: "completed",
                data: full,
                overallScore: data.overallScore,
                pageTitle: data.pageTitle,
              }))
            }
          } else {
            if (pollRefB.current) clearInterval(pollRefB.current)
            pollRefB.current = undefined
            const full = await fetchFullReport(id)
            if (mountedRef.current) {
              setSiteB((prev) => ({
                ...prev,
                status: "completed",
                data: full,
                overallScore: data.overallScore,
                pageTitle: data.pageTitle,
              }))
            }
          }
          return
        }

        if (data.status === "failed" || data.status === "error") {
          if (side === "a") {
            if (pollRefA.current) clearInterval(pollRefA.current)
            pollRefA.current = undefined
            if (mountedRef.current) {
              setSiteA((prev) => ({
                ...prev,
                status: "error",
                error: data.error ?? "Analysis failed",
              }))
            }
          } else {
            if (pollRefB.current) clearInterval(pollRefB.current)
            pollRefB.current = undefined
            if (mountedRef.current) {
              setSiteB((prev) => ({
                ...prev,
                status: "error",
                error: data.error ?? "Analysis failed",
              }))
            }
          }
          return
        }

        if (side === "a" && data.overallScore !== undefined && data.overallScore !== null) {
          setSiteA((prev) => ({ ...prev, overallScore: data.overallScore, pageTitle: data.pageTitle }))
        }
        if (side === "b" && data.overallScore !== undefined && data.overallScore !== null) {
          setSiteB((prev) => ({ ...prev, overallScore: data.overallScore, pageTitle: data.pageTitle }))
        }
      } catch {
        // retry next interval
      }
    }

    poll()
    if (side === "a") {
      pollRefA.current = setInterval(poll, 2000)
    } else {
      pollRefB.current = setInterval(poll, 2000)
    }
  }, [fetchFullReport])

  useEffect(() => {
    if (
      (siteA.status === "completed" || siteA.status === "error") &&
      (siteB.status === "completed" || siteB.status === "error")
    ) {
      cleanupPolling()
      setPhase("results")
    }
  }, [siteA.status, siteB.status, cleanupPolling])

  const handleCompare = async () => {
    if (!urlA.trim() || !urlB.trim()) return
    const formattedA = formatUrl(urlA.trim())
    const formattedB = formatUrl(urlB.trim())
    setSiteA({ id: null, url: formattedA, status: "analyzing", error: null, data: null, overallScore: null, pageTitle: null })
    setSiteB({ id: null, url: formattedB, status: "analyzing", error: null, data: null, overallScore: null, pageTitle: null })
    setCurrentStep(0)
    setPhase("analyzing")

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    const startAnalysis = async (url: string, side: "a" | "b") => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        })
        const data = await res.json()
        if (!mountedRef.current) return

        if (data.id) {
          if (side === "a") {
            setSiteA((prev) => ({ ...prev, id: data.id }))
          } else {
            setSiteB((prev) => ({ ...prev, id: data.id }))
          }
          if (data.status === "completed") {
            const full = await fetchFullReport(data.id)
            if (mountedRef.current) {
              if (side === "a") {
                setSiteA((prev) => ({
                  ...prev,
                  id: data.id,
                  status: "completed",
                  data: full,
                  overallScore: data.overallScore,
                  pageTitle: data.pageTitle,
                }))
              } else {
                setSiteB((prev) => ({
                  ...prev,
                  id: data.id,
                  status: "completed",
                  data: full,
                  overallScore: data.overallScore,
                  pageTitle: data.pageTitle,
                }))
              }
            }
          } else {
            startPolling(data.id, side)
          }
        } else {
          if (mountedRef.current) {
            if (side === "a") {
              setSiteA((prev) => ({ ...prev, status: "error", error: data.error ?? "Failed to start analysis" }))
            } else {
              setSiteB((prev) => ({ ...prev, status: "error", error: data.error ?? "Failed to start analysis" }))
            }
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err instanceof Error ? err.message : "Network error"
          if (side === "a") {
            setSiteA((prev) => ({ ...prev, status: "error", error: msg }))
          } else {
            setSiteB((prev) => ({ ...prev, status: "error", error: msg }))
          }
        }
      }
    }

    startAnalysis(formattedA, "a")
    startAnalysis(formattedB, "b")
  }

  if (phase === "results") {
    const bothComplete = siteA.status === "completed" && siteB.status === "completed"
    const aError = siteA.status === "error"
    const bError = siteB.status === "error"

    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-[#fafafa] sm:text-4xl">
                <GradientText>Comparison Results</GradientText>
              </h1>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#6366f1]" />
                  <span className="text-sm text-[#a1a1aa]">{siteA.url}</span>
                </div>
                <span className="hidden text-[#52525b] sm:inline">vs</span>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#06b6d4]" />
                  <span className="text-sm text-[#a1a1aa]">{siteB.url}</span>
                </div>
              </div>
            </div>

            {(aError || bError) && (
              <div className="mb-6 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/5 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#ef4444]" />
                  <p className="text-sm text-[#ef4444]">
                    {aError && bError
                      ? "Both analyses failed."
                      : aError
                        ? `${siteA.url} failed to analyze.`
                        : `${siteB.url} failed to analyze.`}
                  </p>
                </div>
                {aError && !bError && (
                  <p className="mt-1 text-xs text-[#ef4444]/70">{siteA.error}</p>
                )}
                {bError && !aError && (
                  <p className="mt-1 text-xs text-[#ef4444]/70">{siteB.error}</p>
                )}
              </div>
            )}
          </motion.div>

          {bothComplete && siteA.data && siteB.data && (
            <>
              <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <GlassCard hover={false}>
                  <ScoreCards analysis={siteA.data} label="A" />
                </GlassCard>
                <GlassCard hover={false}>
                  <ScoreCards analysis={siteB.data} label="B" />
                </GlassCard>
              </div>

              <Tabs defaultValue="technologies" className="mb-8">
                <TabsList>
                  <TabsTrigger value="technologies">Technologies</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture</TabsTrigger>
                </TabsList>

                <TabsContent value="technologies">
                  <GlassCard>
                    <SectionHeader
                      title="Technology Comparison"
                      count={new Set([...siteA.data.technologies, ...siteB.data.technologies]).size}
                    />
                    <TechSection a={siteA.data} b={siteB.data} />
                  </GlassCard>
                </TabsContent>

                <TabsContent value="performance">
                  <GlassCard>
                    <SectionHeader title="Performance Comparison" />
                    <PerformanceSection a={siteA.data} b={siteB.data} />
                  </GlassCard>
                </TabsContent>

                <TabsContent value="design">
                  <GlassCard>
                    <SectionHeader title="Design Comparison" />
                    <DesignSection a={siteA.data} b={siteB.data} />
                  </GlassCard>
                </TabsContent>

                <TabsContent value="architecture">
                  <GlassCard>
                    <SectionHeader title="Architecture Comparison" />
                    <ArchitectureSection a={siteA.data} b={siteB.data} />
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </>
          )}

          {aError && bError && (
            <div className="flex flex-col items-center justify-center py-20">
              <XCircle size={48} className="mb-4 text-[#ef4444]" />
              <p className="mb-2 text-lg font-medium text-[#fafafa]">Both analyses failed</p>
              <p className="mb-6 text-sm text-[#52525b]">
                {siteA.error && siteB.error
                  ? `${siteA.error} · ${siteB.error}`
                  : siteA.error ?? siteB.error}
              </p>
              <Button onClick={() => setPhase("form")}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === "analyzing") {
    const aDone = siteA.status === "completed" || siteA.status === "error"
    const bDone = siteB.status === "completed" || siteB.status === "error"
    const progress = aDone && bDone ? 100 : Math.min(
      ((siteA.status === "analyzing" || siteA.status === "pending" ? 0 : 50) +
        (siteB.status === "analyzing" || siteB.status === "pending" ? 0 : 50)),
      95,
    )

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key="analyzing"
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
              <p className="mb-1 text-lg text-[#a1a1aa]">Analyzing both sites</p>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", aDone ? "bg-[#10b981]" : "bg-[#6366f1] animate-pulse")} />
                  <span className={cn("text-sm", aDone ? "text-[#10b981]" : "text-[#a1a1aa]")}>
                    {extractDomain(siteA.url)}
                  </span>
                  {siteA.status === "completed" && <CheckCircle2 size={14} className="text-[#10b981]" />}
                  {siteA.status === "error" && <XCircle size={14} className="text-[#ef4444]" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", bDone ? "bg-[#10b981]" : "bg-[#6366f1] animate-pulse")} />
                  <span className={cn("text-sm", bDone ? "text-[#10b981]" : "text-[#a1a1aa]")}>
                    {extractDomain(siteB.url)}
                  </span>
                  {siteB.status === "completed" && <CheckCircle2 size={14} className="text-[#10b981]" />}
                  {siteB.status === "error" && <XCircle size={14} className="text-[#ef4444]" />}
                </div>
              </div>
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
              <p className="text-xs text-[#52525b]">{Math.round(progress)}%</p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                { label: "Site A", done: aDone, error: siteA.status === "error" },
                { label: "Site B", done: bDone, error: siteB.status === "error" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: item.done ? 1 : 0.3, scale: 1 }}
                  className="flex items-center gap-1.5 rounded-full bg-[#121212] px-3 py-1"
                >
                  {item.error ? (
                    <XCircle size={12} className="text-[#ef4444]" />
                  ) : item.done ? (
                    <CheckCircle2 size={12} className="text-[#10b981]" />
                  ) : (
                    <Sparkles size={12} className="text-[#52525b]" />
                  )}
                  <span className="text-xs text-[#a1a1aa]">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366f1]/10">
              <GitCompare size={24} className="text-[#6366f1]" />
            </div>
          </div>
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
                <p className="mb-2 text-xs font-medium text-[#6366f1]">WEBSITE A</p>
                <Input
                  type="url"
                  placeholder="example.com"
                  value={urlA}
                  onChange={(e) => setUrlA(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && urlA.trim() && urlB.trim() && handleCompare()}
                />
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1f1f1f] bg-[#121212]">
                <Plus size={16} className="text-[#6366f1]" />
              </div>
              <div className="flex-1">
                <p className="mb-2 text-xs font-medium text-[#06b6d4]">WEBSITE B</p>
                <Input
                  type="url"
                  placeholder="example.org"
                  value={urlB}
                  onChange={(e) => setUrlB(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && urlA.trim() && urlB.trim() && handleCompare()}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleCompare}
                disabled={!urlA.trim() || !urlB.trim()}
              >
                Compare Sites
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
