import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400"
  if (score >= 70) return "text-yellow-400"
  if (score >= 50) return "text-orange-400"
  return "text-red-400"
}

export function scoreRingColor(score: number): string {
  if (score >= 90) return "#10b981"
  if (score >= 70) return "#eab308"
  if (score >= 50) return "#f97316"
  return "#ef4444"
}

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function relativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
