export interface ColorResult {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  palette: string[]
}

const CSS_COLOR_NAMES: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#eab308",
  gray: "#6b7280",
  grey: "#6b7280",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  orange: "#f97316",
  amber: "#f59e0b",
  lime: "#84cc16",
  emerald: "#10b981",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
  slate: "#64748b",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
  transparent: "transparent",
  currentcolor: "currentColor",
}

function normalizeColor(color: string): string {
  const trimmed = color.trim().toLowerCase()

  if (CSS_COLOR_NAMES[trimmed]) {
    return CSS_COLOR_NAMES[trimmed]
  }

  if (trimmed.startsWith("#")) {
    if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed
    if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
    }
    if (/^#[0-9a-f]{8}$/i.test(trimmed)) return trimmed.slice(0, 7)
  }

  if (trimmed.startsWith("rgb")) {
    const match = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, "0")
      const g = parseInt(match[2]).toString(16).padStart(2, "0")
      const b = parseInt(match[3]).toString(16).padStart(2, "0")
      return `#${r}${g}${b}`
    }
  }

  if (trimmed.startsWith("hsl")) {
    return "#6366f1"
  }

  return trimmed
}

function isSignificantColor(color: string): boolean {
  const normalized = color.toLowerCase()
  if (normalized === "transparent" || normalized === "currentcolor") return false
  if (normalized.startsWith("#0a0a0a") || normalized === "#000000") return true
  if (normalized.startsWith("#ffffff") || normalized === "#fff") return true
  return true
}

export function extractColors(html: string, cssTexts: string[]): ColorResult {
  const colorFrequencies: Map<string, number> = new Map()
  const backgroundColors: Map<string, number> = new Map()
  const textColors: Map<string, number> = new Map()

  const colorRegex = /(?:color|background(?:-color)?|border-color|outline-color)\s*:\s*([^;!]+)/gi
  let match: RegExpExecArray | null

  for (const css of cssTexts) {
    while ((match = colorRegex.exec(css)) !== null) {
      const rawColor = match[1]?.trim()
      if (!rawColor) continue

      const normalized = normalizeColor(rawColor)
      if (!isSignificantColor(normalized)) continue
      if (normalized.length < 4) continue

      const property = match[0].toLowerCase()

      if (property.startsWith("background") || property.startsWith("background-color")) {
        backgroundColors.set(normalized, (backgroundColors.get(normalized) ?? 0) + 1)
      } else if (property.startsWith("color") && !property.startsWith("background")) {
        textColors.set(normalized, (textColors.get(normalized) ?? 0) + 1)
      }

      colorFrequencies.set(normalized, (colorFrequencies.get(normalized) ?? 0) + 1)
    }
  }

  const styleTagRegex = /style=["'][^"']*?(?:color|background)[^"']*?(["'])/gi
  while ((match = styleTagRegex.exec(html)) !== null) {
    const styleContent = match[0]
    const colorMatch = styleContent.match(/(?:color|background)\s*:\s*([^;"'!]+)/i)
    if (colorMatch) {
      const normalized = normalizeColor(colorMatch[1])
      if (isSignificantColor(normalized)) {
        colorFrequencies.set(normalized, (colorFrequencies.get(normalized) ?? 0) + 1)
      }
    }
  }

  const sortByFrequency = (map: Map<string, number>): string[] =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)

  const sortedColors = sortByFrequency(colorFrequencies)
  const sortedBackgrounds = sortByFrequency(backgroundColors)
  const sortedTexts = sortByFrequency(textColors)

  const primary = sortedColors[0] ?? "#6366f1"
  const secondary = sortedColors[1] ?? (primary === "#6366f1" ? "#06b6d4" : "#6366f1")
  const accent = sortedColors[2] ?? (secondary === "#06b6d4" ? "#8b5cf6" : "#06b6d4")
  const background = sortedBackgrounds[0] ?? "#0a0a0a"
  const text = sortedTexts[0] ?? "#fafafa"

  const palette = sortedColors.slice(0, 6)

  return {
    primary,
    secondary,
    accent,
    background,
    text,
    palette: palette.length > 0 ? palette : ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#eab308", "#ef4444"],
  }
}
