import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { ReportView } from "@/components/report/report-view"

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReportPageProps) {
  const { id } = await params
  const analysis = await prisma.analysis.findUnique({
    where: { id },
    select: { pageTitle: true, url: true },
  })

  if (!analysis) return { title: "Report Not Found" }

  return {
    title: `${analysis.pageTitle ?? analysis.url} — Prism`,
    description: `Technology analysis report for ${analysis.url}`,
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
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
    notFound()
  }

  return <ReportView analysis={analysis} />
}
