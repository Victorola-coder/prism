import { Suspense } from "react"
import { AnalyzeClient } from "@/components/analyze/analyze-client"

export const metadata = {
  title: "Analyze",
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={null}>
      <AnalyzeClient />
    </Suspense>
  )
}
