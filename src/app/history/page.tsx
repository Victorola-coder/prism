import { Suspense } from "react"
import { prisma } from "@/lib/db"
import { HistoryClient } from "@/components/history/history-client"

export const metadata = {
  title: "Analysis History",
}

export default async function HistoryPage() {
  let analyses: {
    id: string
    url: string
    pageTitle: string | null
    overallScore: number | null
    status: string
    technologyCount: number
    analyzedAt: Date
  }[] = []

  try {
    const items = await prisma.analysis.findMany({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        _count: { select: { technologies: true } },
      },
    })

    analyses = items.map((a) => ({
      id: a.id,
      url: a.url,
      pageTitle: a.pageTitle,
      overallScore: a.overallScore,
      status: a.status,
      technologyCount: a._count.technologies,
      analyzedAt: a.createdAt,
    }))
  } catch {
    // DB not available
  }

  return (
    <Suspense fallback={null}>
      <HistoryClient analyses={analyses} />
    </Suspense>
  )
}
