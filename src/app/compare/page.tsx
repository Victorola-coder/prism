import { Suspense } from "react"
import { CompareClient } from "@/components/compare/compare-client"

export const metadata = {
  title: "Compare",
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareClient />
    </Suspense>
  )
}
