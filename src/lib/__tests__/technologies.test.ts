import { describe, it, expect } from "vitest"
import { detectTechnologies } from "../analyzer/technologies"

describe("detectTechnologies", () => {
  it("detects React from window pattern", () => {
    const html = `<script>const e = React.createElement</script>`
    const headers = {}
    const result = detectTechnologies(html, headers)
    const react = result.find((t) => t.name === "React")
    expect(react).toBeDefined()
    expect(react!.category).toBe("Library")
    expect(react!.confidence).toBeGreaterThan(0)
  })

  it("detects Next.js from script pattern", () => {
    const html = `<script src="/_next/static/chunks/main.js"></script>`
    const headers = {}
    const result = detectTechnologies(html, headers)
    const next = result.find((t) => t.name === "Next.js")
    expect(next).toBeDefined()
    expect(next!.confidence).toBeGreaterThan(0)
  })

  it("detects Tailwind CSS from HTML class pattern", () => {
    const html = `<div class="flex items-center bg-blue-500 hover:bg-blue-600 text-sm:leading-5">`
    const headers = {}
    const result = detectTechnologies(html, headers)
    const tailwind = result.find((t) => t.name === "Tailwind CSS")
    expect(tailwind).toBeDefined()
    expect(tailwind!.confidence).toBeGreaterThan(0)
  })

  it("detects Cloudflare from headers", () => {
    const html = "<html></html>"
    const headers = { server: "cloudflare", "cf-ray": "abc123" }
    const result = detectTechnologies(html, headers)
    const cf = result.find((t) => t.name === "Cloudflare")
    expect(cf).toBeDefined()
    expect(cf!.confidence).toBeGreaterThan(0)
  })

  it("detects Google Analytics", () => {
    const html = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>`
    const headers = {}
    const result = detectTechnologies(html, headers)
    const ga = result.find((t) => t.name === "Google Analytics")
    expect(ga).toBeDefined()
    expect(ga!.confidence).toBeGreaterThan(0)
  })

  it("returns no matches for unknown HTML", () => {
    const html = "<html><head></head><body><p>Hello world</p></body></html>"
    const headers = {}
    const result = detectTechnologies(html, headers)
    expect(result).toHaveLength(0)
  })

  it("extracts version when present", () => {
    const html = `<meta name="generator" content="Next.js v14.2.5" />`
    const headers = {}
    const result = detectTechnologies(html, headers)
    const next = result.find((t) => t.name === "Next.js")
    expect(next).toBeDefined()
    expect(next!.version).toBe("14.2.5")
  })
})
