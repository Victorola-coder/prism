import { prisma } from "@/lib/db"
import { detectTechnologies } from "./technologies"
import { detectFonts } from "./fonts"
import { extractColors } from "./colors"
import { captureScreenshot } from "./screenshots"
import type { TechnologyMatch } from "./technologies"

interface FetchResult {
  html: string
  headers: Record<string, string>
  cssTexts: string[]
  pageTitle: string
}

async function fetchPage(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })

    const html = await response.text()

    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value
    })

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const pageTitle = titleMatch?.[1]?.trim() ?? new URL(url).hostname

    const cssTexts: string[] = []

    const linkMatches = html.matchAll(/<link[^>]*href=["']([^"']*\.css[^"']*)["'][^>]*>/gi)
    for (const linkMatch of linkMatches) {
      try {
        const cssUrl = linkMatch[1]
        const absoluteCssUrl = cssUrl.startsWith("http")
          ? cssUrl
          : new URL(cssUrl, url).toString()

        const cssResponse = await fetch(absoluteCssUrl, {
          signal: AbortSignal.timeout(5000),
        })
        const cssText = await cssResponse.text()
        cssTexts.push(cssText)
      } catch {
        // skip failed CSS fetches
      }
    }

    const styleTags = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    for (const styleMatch of styleTags) {
      cssTexts.push(styleMatch[1])
    }

    return { html, headers, cssTexts, pageTitle }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch page"
    throw new Error(`Failed to fetch ${url}: ${message}`)
  }
}

function calculateOverallScore(technologies: TechnologyMatch[]): number {
  const scores: number[] = []

  const hasFramework = technologies.some((t) => t.category === "Framework")
  const hasModernCSS = technologies.some((t) => t.name === "Tailwind CSS" || t.name === "CSS Modules")
  const hasTypeScript = technologies.some((t) => t.name === "TypeScript")
  const hasSEO = technologies.some((t) => t.name === "Open Graph" || t.name === "JSON-LD")
  const hasCDN = technologies.some((t) => t.category === "CDN")
  const hasAnalytics = technologies.some((t) => t.category === "Analytics")
  const hasModernBuild = technologies.some((t) =>
    ["Vite", "Turbopack", "Next.js"].includes(t.name),
  )

  if (hasFramework) scores.push(90)
  if (hasModernCSS) scores.push(85)
  if (hasTypeScript) scores.push(95)
  if (hasSEO) scores.push(80)
  if (hasCDN) scores.push(85)
  if (hasAnalytics) scores.push(75)
  if (hasModernBuild) scores.push(90)

  if (scores.length === 0) return 50

  const total = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(total)
}

export interface AnalysisOptions {
  url: string
  analysisId: string
  takeScreenshot?: boolean
}

export async function runAnalysis(options: AnalysisOptions) {
  const { url, analysisId, takeScreenshot = false } = options

  try {
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "analyzing" },
    })

    const { html, headers, cssTexts, pageTitle } = await fetchPage(url)

    const technologyMatches = detectTechnologies(html, headers)

    const fonts = detectFonts(html, cssTexts)
    const colors = extractColors(html, cssTexts)

    const overallScore = calculateOverallScore(technologyMatches)

    const hasDesignSystem = technologyMatches.some(
      (t) => t.category === "CSS Framework" || t.name === "Material UI" || t.name === "Chakra UI",
    )

    const hostingTech = technologyMatches.find((t) => t.category === "Hosting")
    const cdnTech = technologyMatches.find((t) => t.category === "CDN")

    let screenshotUrl: string | undefined
    if (takeScreenshot) {
      const screenshot = await captureScreenshot(url)
      if (screenshot.base64) {
        screenshotUrl = `data:image/jpeg;base64,${screenshot.base64}`
      }
    }

    let lighthouseResult: Awaited<ReturnType<typeof import("./lighthouse").runLighthouse>> | null = null
    try {
      const { runLighthouse } = await import("./lighthouse")
      lighthouseResult = await runLighthouse(url)
    } catch {
      // Lighthouse failed, skip it
    }

    const finalScore = lighthouseResult
      ? Math.round(
          (overallScore +
            lighthouseResult.performance +
            lighthouseResult.accessibility +
            lighthouseResult.seo +
            lighthouseResult.bestPractices) /
            5,
        )
      : overallScore

    await prisma.$transaction(async (tx) => {
      await tx.analysis.update({
        where: { id: analysisId },
        data: {
          status: "completed",
          pageTitle,
          screenshotUrl,
          overallScore: finalScore,
        },
      })

      if (technologyMatches.length > 0) {
        await tx.technology.createMany({
          data: technologyMatches.map((t) => ({
            analysisId,
            name: t.name,
            category: t.category,
            version: t.version,
            icon: t.icon,
            confidence: t.confidence,
          })),
        })
      }

      if (lighthouseResult) {
        await tx.lighthouseResult.create({
          data: {
            analysisId,
            performance: lighthouseResult.performance,
            accessibility: lighthouseResult.accessibility,
            seo: lighthouseResult.seo,
            bestPractices: lighthouseResult.bestPractices,
            lcp: lighthouseResult.lcp,
            fid: lighthouseResult.fid,
            cls: lighthouseResult.cls,
            raw: lighthouseResult.raw ? JSON.stringify(lighthouseResult.raw) : null,
          },
        })
      }

      if (fonts.length > 0) {
        await tx.detectedFont.createMany({
          data: fonts.map((f) => ({
            analysisId,
            family: f.family,
            category: f.category,
            variants: f.variants,
          })),
        })
      }

      await tx.colorPalette.create({
        data: {
          analysisId,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          background: colors.background,
          text: colors.text,
          palette: JSON.stringify(colors.palette),
        },
      })

      await tx.designSystem.create({
        data: {
          analysisId,
          hasDesignSystem,
          framework: technologyMatches.find((t) => t.category === "Framework")?.name,
          components: technologyMatches.length,
          tokens: JSON.stringify({
            colors: colors.palette,
            fonts: fonts.map((f) => f.family),
            spacing: "4px base unit",
            borderRadius: "12px",
          }),
        },
      })

      await tx.architecture.create({
        data: {
          analysisId,
          type: technologyMatches.find((t) => t.category === "Framework")?.name ?? "Unknown",
          hosting: hostingTech?.name,
          cdn: cdnTech?.name,
          diagram: JSON.stringify({
            technologies: technologyMatches.slice(0, 10).map((t) => t.name),
            hosting: hostingTech?.name,
            cdn: cdnTech?.name,
            rendering:
              technologyMatches.some((t) => t.name === "Next.js" || t.name === "Nuxt.js")
                ? "SSR + Static"
                : "Client-side",
          }),
        },
      })

      if (process.env.OPENAI_API_KEY) {
        try {
          const { generateAISummary } = await import("./ai")
          const aiSummary = await generateAISummary(url, technologyMatches, fonts, colors, overallScore)

          await tx.aISummary.create({
            data: {
              analysisId,
              summary: aiSummary.summary,
              insights: JSON.stringify(aiSummary.insights),
            },
          })
        } catch (error) {
          console.error("AI summary generation failed:", error)

          await tx.aISummary.create({
            data: {
              analysisId,
              summary: generateFallbackSummary(url, technologyMatches, overallScore),
              insights: JSON.stringify(generateFallbackInsights(technologyMatches, overallScore)),
            },
          })
        }
      } else {
        await tx.aISummary.create({
          data: {
            analysisId,
            summary: generateFallbackSummary(url, technologyMatches, overallScore),
            insights: JSON.stringify(generateFallbackInsights(technologyMatches, overallScore)),
          },
        })
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed"

    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: "failed", error: message },
    })

    console.error(`Analysis failed for ${url}:`, message)
  }
}

function generateFallbackSummary(url: string, technologies: TechnologyMatch[], score: number): string {
  const domain = new URL(url).hostname
  const frameworks = technologies.filter((t) => t.category === "Framework").map((t) => t.name)
  const cssFrameworks = technologies.filter((t) => t.category === "CSS Framework").map((t) => t.name)
  const hosting = technologies.find((t) => t.category === "Hosting")?.name
  const analytics = technologies.filter((t) => t.category === "Analytics").map((t) => t.name)

  const parts: string[] = []

  if (frameworks.length > 0) {
    parts.push(`built with ${frameworks.join(" and ")}`)
  } else {
    parts.push("built without a major frontend framework")
  }

  if (cssFrameworks.length > 0) {
    parts.push(`styling with ${cssFrameworks.join(" and ")}`)
  }

  if (hosting) {
    parts.push(`hosted on ${hosting}`)
  }

  if (analytics.length > 0) {
    parts.push(`using ${analytics.join(" and ")} for analytics`)
  }

  return `${domain} is ${parts.join(", ")}. Overall technology score: ${score}/100.`
}

function generateFallbackInsights(technologies: TechnologyMatch[], score: number): string[] {
  const insights: string[] = []

  const hasFramework = technologies.some((t) => t.category === "Framework")
  const hasModernCSS = technologies.some((t) => t.name === "Tailwind CSS")
  const hasTypeScript = technologies.some((t) => t.name === "TypeScript")
  const hasSEO = technologies.some((t) => t.name === "Open Graph" || t.name === "JSON-LD")
  const hasCDN = technologies.some((t) => t.category === "CDN")
  const hasAnalytics = technologies.some((t) => t.category === "Analytics")
  const hasModernBuild = technologies.some((t) =>
    ["Vite", "Turbopack", "Next.js"].includes(t.name),
  )

  if (hasFramework) insights.push("Uses a modern JavaScript framework")
  if (hasModernCSS) insights.push("Utility-first CSS approach with Tailwind CSS")
  if (hasTypeScript) insights.push("Type-safe development with TypeScript")
  if (hasSEO) insights.push("SEO optimized with structured data")
  if (hasCDN) insights.push("Content delivered via CDN for fast global access")
  if (hasAnalytics) insights.push("Has analytics tracking implemented")
  if (hasModernBuild) insights.push("Modern build tooling for optimized bundles")
  if (score >= 80) insights.push("Strong overall technology adoption")
  else if (score >= 60) insights.push("Moderate technology adoption with room for improvement")

  return insights
}
