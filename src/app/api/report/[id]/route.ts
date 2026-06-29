import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
      where: { id },
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

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      id: analysis.id,
      url: analysis.url,
      status: analysis.status,
      error: analysis.error,
      pageTitle: analysis.pageTitle,
      screenshotUrl: analysis.screenshotUrl,
      overallScore: analysis.overallScore,
      technologies: analysis.technologies.map((t) => ({
        name: t.name,
        category: t.category,
        version: t.version,
        icon: t.icon,
        confidence: t.confidence,
      })),
      lighthouse: analysis.lighthouse
        ? {
            performance: analysis.lighthouse.performance,
            accessibility: analysis.lighthouse.accessibility,
            seo: analysis.lighthouse.seo,
            bestPractices: analysis.lighthouse.bestPractices,
            lcp: analysis.lighthouse.lcp,
            fid: analysis.lighthouse.fid,
            cls: analysis.lighthouse.cls,
          }
        : undefined,
      fonts: analysis.fonts.map((f) => ({
        family: f.family,
        category: f.category,
        variants: f.variants,
      })),
      colors: analysis.colors
        ? {
            primary: analysis.colors.primary,
            secondary: analysis.colors.secondary,
            accent: analysis.colors.accent,
            background: analysis.colors.background,
            text: analysis.colors.text,
            palette: analysis.colors.palette as string[],
          }
        : undefined,
      designSystem: analysis.designSystem
        ? {
            hasDesignSystem: analysis.designSystem.hasDesignSystem,
            framework: analysis.designSystem.framework,
            components: analysis.designSystem.components,
            tokens: analysis.designSystem.tokens as Record<string, string>,
          }
        : undefined,
      aiSummary: analysis.aiSummary
        ? {
            summary: analysis.aiSummary.summary,
            insights: analysis.aiSummary.insights as string[],
          }
        : undefined,
      architecture: analysis.architecture
        ? {
            type: analysis.architecture.type,
            hosting: analysis.architecture.hosting,
            cdn: analysis.architecture.cdn,
          }
        : undefined,
    })
  } catch (error) {
    console.error("Report fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
