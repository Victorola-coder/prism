import { ImageResponse } from "next/og"
import { prisma } from "@/lib/db"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface OGProps {
  params: Promise<{ id: string }>
}

export default async function OpenGraphImage({ params }: OGProps) {
  const { id } = await params

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    select: {
      url: true,
      pageTitle: true,
      overallScore: true,
      _count: { select: { technologies: true } },
    },
  })

  const domain = analysis?.pageTitle ?? analysis?.url ?? "Unknown"
  const score = analysis?.overallScore ?? 0
  const techCount = analysis?._count.technologies ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #121212 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            P
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, color: "#fafafa" }}>Prism</span>
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fafafa",
            textAlign: "center",
            margin: "0 0 8px 0",
            padding: "0 40px",
          }}
        >
          {domain}
        </h1>

        <p
          style={{
            fontSize: 22,
            color: "#a1a1aa",
            textAlign: "center",
            margin: 0,
          }}
        >
          {analysis?.url ?? "Website Analysis"}
        </p>

        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: score >= 80 ? "#10b981" : score >= 60 ? "#eab308" : "#ef4444",
              }}
            >
              {Math.round(score)}
            </div>
            <div style={{ fontSize: 14, color: "#52525b", textTransform: "uppercase", letterSpacing: 2 }}>
              Score
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#6366f1" }}>{techCount}</div>
            <div style={{ fontSize: 14, color: "#52525b", textTransform: "uppercase", letterSpacing: 2 }}>
              Technologies
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
