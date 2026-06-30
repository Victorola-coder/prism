import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(request)
  const limit = checkRateLimit(ip, { maxRequests: 60, windowMs: 60000 })

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    )
  }

  try {
    const { id } = await params

    const analysis = await prisma.analysis.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        error: true,
        overallScore: true,
        pageTitle: true,
        url: true,
      },
    })

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Status fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
