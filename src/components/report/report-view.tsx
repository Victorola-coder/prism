import { Suspense } from "react"
import { ReportClient } from "./report-client"
import { Skeleton } from "@/components/ui/skeleton"

interface ReportViewProps {
  analysis: {
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
}

function ReportViewSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-10 w-96" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}

export function ReportView({ analysis }: ReportViewProps) {
  if (analysis.status === "pending" || analysis.status === "analyzing") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-[#a1a1aa]">Analysis in progress...</p>
          <p className="mt-2 text-sm text-[#52525b]">Refresh to check status</p>
        </div>
      </div>
    )
  }

  if (analysis.status === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-lg font-medium text-[#ef4444]">Analysis Failed</p>
          <p className="mt-2 text-sm text-[#a1a1aa]">{analysis.error ?? "An unknown error occurred."}</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<ReportViewSkeleton />}>
      <ReportClient analysis={analysis} />
    </Suspense>
  )
}
