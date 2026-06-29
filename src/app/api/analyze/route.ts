import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { formatUrl, extractDomain } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 },
      )
    }

    const formattedUrl = formatUrl(url)

    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 },
      )
    }

    const existing = await prisma.analysis.findFirst({
      where: { url: formattedUrl, status: "completed" },
      orderBy: { createdAt: "desc" },
      include: {
        technologies: true,
        lighthouse: true,
        fonts: true,
        colors: true,
        designSystem: true,
        aiSummary: true,
        architecture: true,
      },
    })

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        status: existing.status,
        url: existing.url,
        pageTitle: existing.pageTitle,
        screenshotUrl: existing.screenshotUrl,
        overallScore: existing.overallScore,
        technologies: existing.technologies.map((t) => ({
          name: t.name,
          category: t.category,
          version: t.version,
          icon: t.icon,
          confidence: t.confidence,
        })),
        lighthouse: existing.lighthouse
          ? {
              performance: existing.lighthouse.performance,
              accessibility: existing.lighthouse.accessibility,
              seo: existing.lighthouse.seo,
              bestPractices: existing.lighthouse.bestPractices,
              lcp: existing.lighthouse.lcp,
              fid: existing.lighthouse.fid,
              cls: existing.lighthouse.cls,
            }
          : undefined,
        fonts: existing.fonts.map((f) => ({
          family: f.family,
          category: f.category,
          variants: f.variants,
        })),
        colors: existing.colors
          ? {
              primary: existing.colors.primary,
              secondary: existing.colors.secondary,
              accent: existing.colors.accent,
              background: existing.colors.background,
              text: existing.colors.text,
              palette: existing.colors.palette as string[],
            }
          : undefined,
        designSystem: existing.designSystem
          ? {
              hasDesignSystem: existing.designSystem.hasDesignSystem,
              framework: existing.designSystem.framework,
              components: existing.designSystem.components,
              tokens: existing.designSystem.tokens as Record<string, string>,
            }
          : undefined,
        aiSummary: existing.aiSummary
          ? {
              summary: existing.aiSummary.summary,
              insights: existing.aiSummary.insights as string[],
            }
          : undefined,
        architecture: existing.architecture
          ? {
              type: existing.architecture.type,
              hosting: existing.architecture.hosting,
              cdn: existing.architecture.cdn,
            }
          : undefined,
      })
    }

    const analysis = await prisma.analysis.create({
      data: {
        url: formattedUrl,
        pageTitle: extractDomain(formattedUrl),
        status: "pending",
      },
    })

    return NextResponse.json({
      id: analysis.id,
      status: analysis.status,
      url: analysis.url,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
