"use client"

import { useSearchParams } from "next/navigation"
import { ReportClient } from "@/components/report/report-client"
import { extractDomain } from "@/lib/utils"

const demoAnalysis = {
  id: "demo",
  url: "https://example.com",
  status: "completed",
  pageTitle: "Example Website",
  screenshotUrl: null,
  overallScore: 92,
  error: null,
  technologies: [
    { name: "Next.js", category: "Framework", version: "16.2.9", icon: "nextjs", confidence: 98 },
    { name: "React", category: "Library", version: "19.2.4", icon: "react", confidence: 98 },
    { name: "TypeScript", category: "Language", version: "5.9", icon: "typescript", confidence: 95 },
    { name: "Tailwind CSS", category: "CSS Framework", version: "4.x", icon: "tailwind", confidence: 92 },
    { name: "Vercel", category: "Hosting", version: null, icon: "vercel", confidence: 90 },
    { name: "Geist Font", category: "Font Service", version: null, icon: "google-fonts", confidence: 88 },
    { name: "Framer Motion", category: "Animation Library", version: "12.x", icon: "framer", confidence: 85 },
    { name: "Open Graph", category: "SEO", version: null, icon: "opengraph", confidence: 82 },
  ],
  lighthouse: {
    performance: 96,
    accessibility: 88,
    seo: 95,
    bestPractices: 92,
    lcp: 1200,
    fid: 12,
    cls: 0.05,
  },
  fonts: [
    { family: "Geist", category: "Sans-serif", variants: 9 },
    { family: "Geist Mono", category: "Monospace", variants: 7 },
  ],
  colors: {
    primary: "#6366f1",
    secondary: "#06b6d4",
    accent: "#8b5cf6",
    background: "#0a0a0a",
    text: "#fafafa",
    palette: ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#eab308", "#ef4444"],
  },
  designSystem: {
    hasDesignSystem: true,
    framework: "Tailwind CSS",
    components: 24,
    tokens: ["--primary", "--radius", "--spacing"],
  },
  aiSummary: {
    summary:
      "This website is built with Next.js (SSR + Static Generation) and hosted on Vercel. It uses a modern tech stack including React 19, TypeScript, and Tailwind CSS v4 for styling. Geist is the primary typeface.",
    insights: [
      "Excellent performance with 96 Lighthouse score",
      "Strong accessibility practices (88/100)",
      "SEO optimized with proper meta tags and Open Graph",
      "Modern design system with consistent tokens",
      "Efficient CDN delivery via Vercel Edge Network",
    ],
  },
  architecture: {
    type: "SSR + Static",
    hosting: "Vercel",
    cdn: "Vercel Edge Network",
    diagram: null,
  },
}

export function DemoReportClient() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || "https://example.com"
  const domain = extractDomain(url)

  return <ReportClient analysis={{ ...demoAnalysis, url, pageTitle: domain }} />
}
