import { describe, it, expect } from "vitest"
import { formatUrl, extractDomain } from "../utils"

describe("formatUrl", () => {
  it("adds https:// when no protocol is present", () => {
    expect(formatUrl("example.com")).toBe("https://example.com")
  })

  it("keeps https:// when already present", () => {
    expect(formatUrl("https://example.com")).toBe("https://example.com")
  })

  it("keeps http:// when already present", () => {
    expect(formatUrl("http://example.com")).toBe("http://example.com")
  })

  it("handles empty string", () => {
    expect(formatUrl("")).toBe("https://")
  })

  it("handles subdomain URL", () => {
    expect(formatUrl("sub.example.com")).toBe("https://sub.example.com")
  })
})

describe("extractDomain", () => {
  it("extracts domain from full URL", () => {
    expect(extractDomain("https://www.example.com/path?q=1")).toBe("www.example.com")
  })

  it("extracts domain without www", () => {
    expect(extractDomain("https://example.com")).toBe("example.com")
  })

  it("handles URL with port", () => {
    expect(extractDomain("https://example.com:8080/path")).toBe("example.com")
  })

  it("returns the string when URL is invalid", () => {
    expect(extractDomain("not-a-url")).toBe("not-a-url")
  })
})
