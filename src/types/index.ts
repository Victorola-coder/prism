export interface TechnologyBadge {
  name: string
  category: string
  version?: string
  icon?: string
  confidence: number
}

export interface LighthouseScores {
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
}

export interface CoreWebVitals {
  lcp?: number
  fid?: number
  cls?: number
}

export interface DetectedFont {
  family: string
  category: string
  variants: number
}

export interface ColorPalette {
  primary: string
  secondary?: string
  accent?: string
  background?: string
  text?: string
  palette?: string[]
}

export interface DesignSystemInfo {
  hasDesignSystem: boolean
  framework?: string
  components?: number
  tokens?: Record<string, string>
}

export interface ArchitectureInfo {
  type?: string
  hosting?: string
  cdn?: string
  diagram?: Record<string, unknown>
}

export interface AISummary {
  summary: string
  insights?: string[]
}

export interface AnalysisResult {
  id: string
  url: string
  status: "pending" | "analyzing" | "completed" | "failed"
  error?: string
  screenshotUrl?: string
  overallScore?: number
  pageTitle?: string
  technologies: TechnologyBadge[]
  lighthouse?: LighthouseScores & CoreWebVitals
  fonts: DetectedFont[]
  colors?: ColorPalette
  designSystem?: DesignSystemInfo
  architecture?: ArchitectureInfo
  aiSummary?: AISummary
}

export interface AnalysisStatusResponse {
  id: string
  status: AnalysisResult["status"]
  progress?: number
  message?: string
}

export interface TrendingAnalysis {
  id: string
  url: string
  pageTitle?: string
  overallScore?: number
  technologyCount: number
  analyzedAt: string
}
