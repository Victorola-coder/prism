import { Suspense } from "react"
import { DemoReportClient } from "@/components/report/demo-report-client"

export const metadata = {
  title: "Report",
}

export default function DemoReportPage() {
  return (
    <Suspense fallback={null}>
      <DemoReportClient />
    </Suspense>
  )
}
