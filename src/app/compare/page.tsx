import { Suspense } from "react"
import { CompareClient } from "@/components/compare/compare-client"

export const metadata = {
  title: "Compare Websites — Prism",
  description: "Analyze two websites side by side and compare their technology stacks, performance, and design.",
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareClient />
    </Suspense>
  )
}
