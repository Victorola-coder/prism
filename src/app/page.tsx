import { Hero } from "@/components/home/hero"
import { FeaturesGrid } from "@/components/home/features-grid"
import { TrendingList } from "@/components/home/trending-list"
import { prisma } from "@/lib/db"
import { TRENDING_SITES } from "@/lib/constants"

export const dynamic = "force-static"
export const revalidate = 60

export default async function HomePage() {
  let recentAnalyses: {
    id: string
    url: string
    pageTitle: string | null
    overallScore: number | null
    technologyCount: number
    analyzedAt: Date
  }[] = []

  try {
    const analyses = await prisma.analysis.findMany({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        _count: { select: { technologies: true } },
      },
    })

    recentAnalyses = analyses.map((a) => ({
      id: a.id,
      url: a.url,
      pageTitle: a.pageTitle,
      overallScore: a.overallScore,
      technologyCount: a._count.technologies,
      analyzedAt: a.createdAt,
    }))
  } catch {
    // DB not available, use static trending sites
  }

  const trendingData =
    recentAnalyses.length > 0
      ? recentAnalyses
      : TRENDING_SITES.map((site, i) => ({
          id: `trending-${i}`,
          url: site.url,
          pageTitle: site.label,
          overallScore: null,
          technologyCount: 0,
          analyzedAt: new Date(),
        }))

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesGrid />
      <TrendingList analyses={trendingData} isDbData={recentAnalyses.length > 0} />
    </div>
  )
}
