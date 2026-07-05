import { describe, it, expect, beforeEach, vi } from "vitest"
import { checkRateLimit } from "../rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("allows the first request", () => {
    const result = checkRateLimit("test-key", { maxRequests: 3, windowMs: 60000 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
    expect(result.resetIn).toBeGreaterThan(0)
  })

  it("blocks requests that exceed max", () => {
    const config = { maxRequests: 2, windowMs: 60000 }
    const key = "burst-key"

    const first = checkRateLimit(key, config)
    expect(first.allowed).toBe(true)

    const second = checkRateLimit(key, config)
    expect(second.allowed).toBe(true)

    const third = checkRateLimit(key, config)
    expect(third.allowed).toBe(false)
    expect(third.remaining).toBe(0)
  })

  it("resets after the window expires", () => {
    const config = { maxRequests: 1, windowMs: 50 }
    const key = "reset-key"

    const first = checkRateLimit(key, config)
    expect(first.allowed).toBe(true)

    const second = checkRateLimit(key, config)
    expect(second.allowed).toBe(false)

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const third = checkRateLimit(key, config)
        expect(third.allowed).toBe(true)
        resolve()
      }, 60)
    })
  })
})
