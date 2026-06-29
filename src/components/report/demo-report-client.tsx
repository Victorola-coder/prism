"use client"

import { useSearchParams } from "next/navigation"
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

const demoTechnologies = [
  { name: "Next.js", category: "Framework", version: "16.2.9", confidence: 98 },
  { name: "React", category: "Library", version: "19.2.4", confidence: 98 },
  { name: "TypeScript", category: "Language", version: "5.9", confidence: 95 },
  { name: "Tailwind CSS", category: "CSS", version: "4.x", confidence: 92 },
  { name: "Vercel", category: "Hosting", confidence: 90 },
  { name: "Geist Font", category: "Font", confidence: 88 },
  { name: "Framer Motion", category: "Animation", version: "12.x", confidence: 85 },
  { name: "Open Graph", category: "SEO", confidence: 82 },
]

const demoFonts = [
  { family: "Geist", category: "Sans-serif", variants: 9 },
  { family: "Geist Mono", category: "Monospace", variants: 7 },
]

const demoColors = {
  primary: "#6366f1",
  secondary: "#06b6d4",
  accent: "#8b5cf6",
  background: "#0a0a0a",
  text: "#fafafa",
  palette: ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#eab308", "#ef4444"],
}

export function DemoReportClient() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || "https://example.com"
  const domain = extractDomain(url)

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
                <span className="text-sm text-[#52525b]">{url}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#fafafa] sm:text-4xl">
                <GradientText>{domain}</GradientText>
              </h1>
            </div>
            <Button variant="secondary" size="sm">
              <Share2 size={16} />
              Share
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {demoTechnologies.slice(0, 5).map((tech) => (
              <Badge key={tech.name} variant="primary">
                {tech.name}
                {tech.version && <span className="ml-1 opacity-60">v{tech.version}</span>}
              </Badge>
            ))}
            <Badge variant="gradient">+{demoTechnologies.length - 5} more</Badge>
          </div>
        </motion.div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="flex flex-col items-center py-6">
              <ScoreRing score={92} size={80} label="Overall" />
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="flex flex-col items-center py-6">
              <ScoreRing score={96} size={80} strokeWidth={6} label="Performance" />
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="flex flex-col items-center py-6">
              <ScoreRing score={88} size={80} strokeWidth={6} label="Accessibility" />
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassCard className="flex flex-col items-center py-6">
              <ScoreRing score={95} size={80} strokeWidth={6} label="SEO" />
            </GlassCard>
          </motion.div>
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
                  {demoTechnologies.length} technologies identified
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {demoTechnologies.map((tech) => (
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

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Architecture</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                    <p className="mb-1 text-xs text-[#52525b]">HOSTING</p>
                    <p className="text-sm font-medium text-[#fafafa]">Vercel</p>
                  </div>
                  <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                    <p className="mb-1 text-xs text-[#52525b]">CDN</p>
                    <p className="text-sm font-medium text-[#fafafa]">Vercel Edge Network</p>
                  </div>
                  <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                    <p className="mb-1 text-xs text-[#52525b]">RENDERING</p>
                    <p className="text-sm font-medium text-[#fafafa]">SSR + Static</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="performance">
            <GlassCard>
              <h3 className="mb-6 text-lg font-semibold text-[#fafafa]">Lighthouse Scores</h3>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Performance", score: 96, icon: BarChart3 },
                  { label: "Accessibility", score: 88, icon: Eye },
                  { label: "SEO", score: 95, icon: Search },
                  { label: "Best Practices", score: 92, icon: CheckCircle2 },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <ScoreRing score={item.score} size={64} />
                    <p className="mt-3 text-sm text-[#a1a1aa]">{item.label}</p>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Core Web Vitals</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "LCP",
                    value: "1.2s",
                    status: "good" as const,
                    desc: "Largest Contentful Paint",
                  },
                  {
                    label: "FID",
                    value: "12ms",
                    status: "good" as const,
                    desc: "First Input Delay",
                  },
                  {
                    label: "CLS",
                    value: "0.05",
                    status: "good" as const,
                    desc: "Cumulative Layout Shift",
                  },
                ].map((vital) => (
                  <div
                    key={vital.label}
                    className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-[#52525b]">{vital.label}</p>
                      {vital.status === "good" ? (
                        <CheckCircle2 size={14} className="text-[#10b981]" />
                      ) : vital.status === "needs-improvement" ? (
                        <AlertTriangle size={14} className="text-[#eab308]" />
                      ) : (
                        <XCircle size={14} className="text-[#ef4444]" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#fafafa]">{vital.value}</p>
                    <p className="text-xs text-[#52525b]">{vital.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="design">
            <GlassCard>
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Color Palette</h3>
                <div className="flex flex-wrap gap-3">
                  {demoColors.palette.map((color) => (
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

              <Separator className="mb-6" />

              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Typography</h3>
                <div className="space-y-3">
                  {demoFonts.map((font) => (
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

              <Separator className="my-6" />

              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#fafafa]">Design System</h3>
                <div className="rounded-lg border border-[#1f1f1f] bg-[#121212] p-4">
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    {[
                      { label: "Border Radius", value: "12px (cards)" },
                      { label: "Spacing", value: "4px base unit" },
                      { label: "Shadows", value: "Subtle glow effects" },
                      { label: "Animations", value: "Spring physics" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-[#52525b]">{item.label}</p>
                        <p className="text-sm text-[#fafafa]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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

              <div className="mb-6 rounded-lg border border-[#1f1f1f] bg-[#121212] p-5">
                <p className="leading-relaxed text-[#a1a1aa]">
                  This website is built with <strong className="text-[#fafafa]">Next.js</strong> (SSR + Static
                  Generation) and hosted on <strong className="text-[#fafafa]">Vercel</strong>. It uses a
                  modern tech stack including <strong className="text-[#fafafa]">React 19</strong>,{" "}
                  <strong className="text-[#fafafa]">TypeScript</strong>, and{" "}
                  <strong className="text-[#fafafa]">Tailwind CSS v4</strong> for styling.{" "}
                  <strong className="text-[#fafafa]">Geist</strong> is the primary typeface.
                </p>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium text-[#fafafa]">Key Insights</h4>
                <div className="space-y-2">
                  {[
                    "Excellent performance with 96 Lighthouse score",
                    "Strong accessibility practices (88/100)",
                    "SEO optimized with proper meta tags and Open Graph",
                    "Modern design system with consistent tokens",
                    "Efficient CDN delivery via Vercel Edge Network",
                  ].map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Sparkles size={14} className="mt-0.5 shrink-0 text-[#6366f1]" />
                      <p className="text-sm text-[#a1a1aa]">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-[#52525b]">
            Demo report &mdash; real analysis coming soon
          </p>
        </motion.div>
      </div>
    </div>
  )
}
