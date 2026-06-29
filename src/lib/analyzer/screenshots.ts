export interface ScreenshotResult {
  url: string
  base64?: string
  error?: string
}

export async function captureScreenshot(url: string): Promise<ScreenshotResult> {
  try {
    let playwrightModule: typeof import("playwright")
    try {
      playwrightModule = await import("playwright")
    } catch {
      return { url, error: "Playwright not installed. Install it with: npm install playwright" }
    }

    const browser = await playwrightModule.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    })

    const page = await context.newPage()

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    })

    await page.waitForTimeout(1000)

    const screenshotBuffer = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    })

    await browser.close()

    return {
      url,
      base64: screenshotBuffer.toString("base64"),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Screenshot capture failed"
    console.error("Screenshot error:", message)
    return { url, error: message }
  }
}
