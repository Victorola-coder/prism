export interface FontMatch {
  family: string
  category: string
  variants: number
}

const FONT_CATEGORIES: Record<string, string> = {
  serif: "Serif",
  "sans-serif": "Sans-serif",
  monospace: "Monospace",
  cursive: "Handwriting",
  fantasy: "Display",
  system: "System",
  display: "Display",
  handwriting: "Handwriting",
}

export function detectFonts(html: string, cssTexts: string[]): FontMatch[] {
  const fonts: Map<string, { category: string; variants: Set<string> }> = new Map()

  const googleFontsRegex =
    /fonts\.googleapis\.com\/css2\?family=([^&"'\s]+)/gi
  let match: RegExpExecArray | null

  while ((match = googleFontsRegex.exec(html)) !== null) {
    const families = match[1].split("&family=")
    for (const familyStr of families) {
      const [family, ...rest] = familyStr.split(":")
      const cleanFamily = family.replace(/\+/g, " ").replace(/[0-9,;]/g, "").trim()
      const weights = rest.length > 0 ? rest.join(":").split(";")[0]?.split(",") ?? [] : ["400"]

      if (cleanFamily) {
        const existing = fonts.get(cleanFamily) ?? {
          category: "Sans-serif",
          variants: new Set<string>(),
        }
        weights.forEach((w) => existing.variants.add(w.trim()))
        fonts.set(cleanFamily, existing)
      }
    }
  }

  const cssFontFaceRegex = /@font-face\s*\{[^}]*(?:font-family\s*:\s*['"]?([^;'"}]+)['"]?)/gi
  while ((match = cssFontFaceRegex.exec(html)) !== null) {
    const family = match[1]?.trim()
    if (family && !fonts.has(family)) {
      fonts.set(family, { category: "Custom", variants: new Set(["400"]) })
    }
  }

  const linkFontRegex = /<link[^>]*href=["']([^"']*fonts[^"']*)["'][^>]*>/gi
  while ((match = linkFontRegex.exec(html)) !== null) {
    const href = match[1]
    const typekitMatch = href.match(/use\.typekit\.net\/([a-z0-9]+)/i)
    if (typekitMatch) {
      if (!fonts.has("Adobe Fonts")) {
        fonts.set("Adobe Fonts (Typekit)", { category: "Sans-serif", variants: new Set(["400"]) })
      }
    }
  }

  const fontStackRegex = /font-family\s*:\s*[^;]*?['"]([^'",]+)['"]/gi
  for (const css of cssTexts) {
    while ((match = fontStackRegex.exec(css)) !== null) {
      const family = match[1]?.trim()
      if (family && !fonts.has(family) && !family.toLowerCase().includes("inherit")) {
        const existing = fonts.get(family) ?? {
          category: "Sans-serif",
          variants: new Set(["400"]),
        }
        fonts.set(family, existing)
      }
    }
  }

  return Array.from(fonts.entries()).map(([family, info]) => {
    const category = FONT_CATEGORIES[info.category.toLowerCase()] ?? info.category
    return {
      family,
      category,
      variants: info.variants.size > 0 ? info.variants.size : 1,
    }
  })
}
