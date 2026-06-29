export interface LighthouseResult {
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
  lcp?: number
  fid?: number
  cls?: number
  raw?: Record<string, string | number | boolean | null | undefined>
}

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

function extractNumericValue(audit: { numericValue?: number } | undefined): number | undefined {
  return audit?.numericValue
}

export async function runLighthouse(url: string): Promise<LighthouseResult | null> {
  let chromeLauncher: typeof import("chrome-launcher")
  let lighthouseModule: typeof import("lighthouse")

  try {
    chromeLauncher = await import("chrome-launcher")
    lighthouseModule = await import("lighthouse")
  } catch {
    console.warn("lighthouse or chrome-launcher not installed")
    return null
  }

  let chrome: Awaited<ReturnType<typeof chromeLauncher.launch>> | null = null

  try {
    chrome = await chromeLauncher.launch({
      chromePath: CHROME_PATH,
      chromeFlags: [
        "--headless",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    })

    const result = await lighthouseModule.default(
      url,
      {
        port: chrome.port,
        output: "json",
        onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
        logLevel: "error" as const,
      },
    )

    if (!result?.lhr) {
      return null
    }

    const { lhr } = result
    const categories = lhr.categories ?? {}

    const audits = lhr.audits ?? {}

    const lcpAudit = audits["largest-contentful-paint"]
    const fidAudit = audits["max-potential-fid"] ?? audits["interactive"]
    const clsAudit = audits["cumulative-layout-shift"]

    return {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
      bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
      lcp: extractNumericValue(lcpAudit),
      fid: extractNumericValue(fidAudit),
      cls: extractNumericValue(clsAudit),
      raw: JSON.parse(
        JSON.stringify({
          fetchTime: lhr.fetchTime,
          lighthouseVersion: lhr.lighthouseVersion,
          requestedUrl: lhr.requestedUrl,
          finalUrl: lhr.finalUrl,
        }),
      ),
    }
  } catch (error) {
    console.warn("Lighthouse audit failed:", error instanceof Error ? error.message : error)
    return null
  } finally {
    if (chrome) {
      try {
        await chrome.kill()
      } catch {
        // best effort cleanup
      }
    }
  }
}
