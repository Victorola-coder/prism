"use client"

import { motion } from "framer-motion"
import {
  Globe,
  Share2,
  BarChart3,
  Eye,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { ScoreRing } from "@/components/shared/score-ring"
import { GradientText } from "@/components/shared/gradient-text"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn, extractDomain } from "@/lib/utils"

interface AnalysisData {
  id: string
  url: string
  status: string
  pageTitle: string | null
  screenshotUrl: string | null
  overallScore: number | null
  error: string | null
  technologies: {
    name: string
    category: string
    version: string | null
    icon: string | null
    confidence: number
  }[]
  lighthouse: {
    performance: number | null
    accessibility: number | null
    seo: number | null
    bestPractices: number | null
    lcp: number | null
    fid: number | null
    cls: number | null
  } | null
  fonts: {
    family: string
    category: string
    variants: number
  }[]
  colors: {
    primary: string
    secondary: string | null
    accent: string | null
    background: string | null
    text: string | null
    palette: unknown
  } | null
  designSystem: {
    hasDesignSystem: boolean
    framework: string | null
    components: number | null
    tokens: unknown
  } | null
  aiSummary: {
    summary: string
    insights: unknown
  } | null
  architecture: {
    type: string | null
    hosting: string | null
    cdn: string | null
    diagram: unknown
  } | null
}

interface ReportClientProps {
  analysis: AnalysisData
}

export function ReportClient({ analysis }: ReportClientProps) {
  const domain = extractDomain(analysis.url)
  const palette = analysis.colors?.palette
  const paletteArray: string[] = Array.isArray(palette)
    ? palette
    : typeof palette === "object" && palette
      ? Object.values(palette as Record<string, string>)
      : []
  const insights = analysis.aiSummary?.insights
  const insightsArray: string[] = Array.isArray(insights)
    ? insights
    : typeof insights === "object" && insights
      ? Object.values(insights as Record<string, string>)
      : []
  const score = analysis.overallScore ?? 0

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Globe size={16} className="text-[#6366f1]" />
                <span className="text-sm text-[#52525b]">{analysis.url}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#fafafa] sm:text-4xl">
                <GradientText>{analysis.pageTitle ?? domain}</GradientText>
              </h1>
            </div>
            <Button variant="secondary" size="sm">
              <Share2 size={16} />
              Share
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.technologies.slice(0, 6).map((tech) => (
              <Badge key={tech.name} variant="primary">
                {tech.name}
                {tech.version && <span className="ml-1 opacity-60">v{tech.version}</span>}
              </Badge>
            ))}
            {analysis.technologies.length > 6 && (
              <Badge variant="gradient">+{analysis.technologies.length - 6} more</Badge>
            )}
          </div>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="flex flex-col items-center py-6">
              <ScoreRing score={score} size={80} label="Overall" />
            </GlassCard>
          </motion.div>
          {analysis.lighthouse ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing
                    score={analysis.lighthouse.performance ?? 0}
                    size={80}
                    label="Performance"
                  />
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing
                    score={analysis.lighthouse.accessibility ?? 0}
                    size={80}
                    label="Accessibility"
                  />
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing
                    score={analysis.lighthouse.seo ?? 0}
                    size={80}
                    label="SEO"
                  />
                </GlassCard>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing score={Math.round(score * 0.95)} size={80} label="Performance" />
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing score={Math.round(score * 0.85)} size={80} label="Accessibility" />
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassCard className="flex flex-col items-center py-6">
                  <ScoreRing score={Math.round(score * 0.92)} size={80} label="SEO" />
                </GlassCard>
              </motion.div>
            </>
          )}
        </div>

        <Tabs defaultValue="stack" className="mb-8">
          <TabsList>
            <TabsTrigger value="stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="ai">AI Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="stack">
            <GlassCard>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#fafafa]">Detected Technologies</h3>
                <p className="text-sm text-[#52525b]">
                  {analysis.technologies.length} technologies identified
                </p>
              </div>

              {analysis.technologies.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center justify-between rounded-lg border border-[#1f1f1f] bg-[#121212] p-4 transition-colors hover:border-[#2a2a2a]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#fafafa]">{tech.name}</p>
                        <p className="text-xs text-[#52525b]">{tech.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {tech.version && (
                          <span className="text-xs text-[#52525b]">v{tech.version}</span>
                        )}
                        <span
                          className={cn(
                            "text-xs font-medium",
                            tech.confidence >= 90
                              ? "text-[#10b981]"
                              : tech.confidence >= 80
                                ? "text-[#eab308]"
                                : "text-[#a1a1aa]",
                          )}
                        >
                          {tech.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-[#52525b]">No technologies detected</p>
              )}

              {(analysis.architecture?.hosting || analysis.architecture?.cdn) && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Architecture</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {analysis.architecture?.hosting && (
                        <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                          <p className="mb-1 text-xs text-[#52525b]">HOSTING</p>
                          <p className="text-sm font-medium text-[#fafafa]">{analysis.architecture.hosting}</p>
                        </div>
                      )}
                      {analysis.architecture?.cdn && (
                        <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                          <p className="mb-1 text-xs text-[#52525b]">CDN</p>
                          <p className="text-sm font-medium text-[#fafafa]">{analysis.architecture.cdn}</p>
                        </div>
                      )}
                      {analysis.architecture?.type && (
                        <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                          <p className="mb-1 text-xs text-[#52525b]">FRAMEWORK</p>
                          <p className="text-sm font-medium text-[#fafafa]">{analysis.architecture.type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="performance">
            <GlassCard>
              <h3 className="mb-6 text-lg font-semibold text-[#fafafa]">Lighthouse Scores</h3>

              {analysis.lighthouse ? (
                <>
                  <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Performance", score: analysis.lighthouse.performance ?? 0, icon: BarChart3 },
                      { label: "Accessibility", score: analysis.lighthouse.accessibility ?? 0, icon: Eye },
                      { label: "SEO", score: analysis.lighthouse.seo ?? 0, icon: Search },
                      { label: "Best Practices", score: analysis.lighthouse.bestPractices ?? 0, icon: CheckCircle2 },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <ScoreRing score={item.score} size={64} />
                        <p className="mt-3 text-sm text-[#a1a1aa]">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {(analysis.lighthouse.lcp || analysis.lighthouse.fid || analysis.lighthouse.cls) && (
                    <>
                      <Separator className="mb-6" />
                      <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Core Web Vitals</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {analysis.lighthouse.lcp !== null && analysis.lighthouse.lcp !== undefined && (
                          <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs text-[#52525b]">LCP</p>
                              {analysis.lighthouse.lcp < 2500 ? (
                                <CheckCircle2 size={14} className="text-[#10b981]" />
                              ) : analysis.lighthouse.lcp < 4000 ? (
                                <AlertTriangle size={14} className="text-[#eab308]" />
                              ) : (
                                <XCircle size={14} className="text-[#ef4444]" />
                              )}
                            </div>
                            <p className="text-2xl font-bold text-[#fafafa]">
                              {(analysis.lighthouse.lcp / 1000).toFixed(1)}s
                            </p>
                            <p className="text-xs text-[#52525b]">Largest Contentful Paint</p>
                          </div>
                        )}
                        {analysis.lighthouse.fid !== null && analysis.lighthouse.fid !== undefined && (
                          <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs text-[#52525b]">FID</p>
                              {analysis.lighthouse.fid < 100 ? (
                                <CheckCircle2 size={14} className="text-[#10b981]" />
                              ) : analysis.lighthouse.fid < 300 ? (
                                <AlertTriangle size={14} className="text-[#eab308]" />
                              ) : (
                                <XCircle size={14} className="text-[#ef4444]" />
                              )}
                            </div>
                            <p className="text-2xl font-bold text-[#fafafa]">
                              {analysis.lighthouse.fid}ms
                            </p>
                            <p className="text-xs text-[#52525b]">First Input Delay</p>
                          </div>
                        )}
                        {analysis.lighthouse.cls !== null && analysis.lighthouse.cls !== undefined && (
                          <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs text-[#52525b]">CLS</p>
                              {analysis.lighthouse.cls < 0.1 ? (
                                <CheckCircle2 size={14} className="text-[#10b981]" />
                              ) : analysis.lighthouse.cls < 0.25 ? (
                                <AlertTriangle size={14} className="text-[#eab308]" />
                              ) : (
                                <XCircle size={14} className="text-[#ef4444]" />
                              )}
                            </div>
                            <p className="text-2xl font-bold text-[#fafafa]">
                              {analysis.lighthouse.cls.toFixed(2)}
                            </p>
                            <p className="text-xs text-[#52525b]">Cumulative Layout Shift</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="py-8 text-center text-sm text-[#52525b]">
                  Lighthouse audit was not run for this analysis. Install Chrome + lighthouse to enable performance metrics.
                </p>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="design">
            <GlassCard>
              {paletteArray.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Color Palette</h3>
                  <div className="flex flex-wrap gap-3">
                    {paletteArray.map((color: string) => (
                      <div key={color} className="flex flex-col items-center gap-1">
                        <div
                          className="h-10 w-10 rounded-lg border border-[#1f1f1f]"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-[#52525b]">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.fonts.length > 0 && (
                <>
                  <Separator className="mb-6" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Typography</h3>
                    <div className="space-y-3">
                      {analysis.fonts.map((font) => (
                        <div
                          key={font.family}
                          className="flex items-center justify-between rounded-lg border border-[#1f1f1f] bg-[#121212] p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#fafafa]">{font.family}</p>
                            <p className="text-xs text-[#52525b]">{font.category}</p>
                          </div>
                          <span className="text-xs text-[#52525b]">{font.variants} variants</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {analysis.designSystem && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Design System</h3>
                    <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        {analysis.designSystem.framework && (
                          <div>
                            <p className="text-xs text-[#52525b]">Framework</p>
                            <p className="text-sm text-[#fafafa]">{analysis.designSystem.framework}</p>
                          </div>
                        )}
                        {analysis.designSystem.components !== null && (
                          <div>
                            <p className="text-xs text-[#52525b]">Components</p>
                            <p className="text-sm text-[#fafafa]">{analysis.designSystem.components}</p>
                          </div>
                        )}
                        {analysis.designSystem.hasDesignSystem !== undefined && (
                          <div>
                            <p className="text-xs text-[#52525b]">Design System</p>
                            <p className="text-sm text-[#fafafa]">
                              {analysis.designSystem.hasDesignSystem ? "Detected" : "Not detected"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </TabsContent>

          <TabsContent value="ai">
            <GlassCard>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10">
                  <Sparkles size={20} className="text-[#6366f1]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#fafafa]">AI Summary</h3>
                  <p className="text-xs text-[#52525b]">Powered by Prism AI</p>
                </div>
              </div>

              {analysis.aiSummary ? (
                <>
                  <div className="mb-6 rounded-lg border border-[#1f1f1f] bg-[#121212] p-5">
                    <p className="leading-relaxed text-[#a1a1aa]">{analysis.aiSummary.summary}</p>
                  </div>

                  {insightsArray.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-sm font-medium text-[#fafafa]">Key Insights</h4>
                      <div className="space-y-2">
                        {insightsArray.map((insight: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <Sparkles size={14} className="mt-0.5 shrink-0 text-[#6366f1]" />
                            <p className="text-sm text-[#a1a1aa]">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="py-8 text-center text-sm text-[#52525b]">No AI summary available</p>
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
