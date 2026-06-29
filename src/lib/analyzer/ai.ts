import OpenAI from "openai"
import type { TechnologyMatch } from "./technologies"
import type { FontMatch } from "./fonts"
import type { ColorResult } from "./colors"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
})

export interface AISummaryResult {
  summary: string
  insights: string[]
}

export async function generateAISummary(
  url: string,
  technologies: TechnologyMatch[],
  fonts: FontMatch[],
  colors: ColorResult,
  score: number,
): Promise<AISummaryResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      summary: `This website uses ${technologies.map((t) => t.name).join(", ")}.`,
      insights: ["Add an OpenAI API key to generate AI-powered insights."],
    }
  }

  const techSummary = technologies
    .map((t) => `${t.name} (${t.category})${t.version ? ` v${t.version}` : ""}`)
    .join(", ")

  const fontSummary = fonts.map((f) => `${f.family} (${f.category})`).join(", ")

  const prompt = `Analyze this website and provide a concise, insightful summary.

URL: ${url}

Technologies detected: ${techSummary}
Fonts: ${fontSummary}
Color palette: primary=${colors.primary}, secondary=${colors.secondary}, accent=${colors.accent}
Overall tech score: ${score}/100

Provide:
1. A 2-3 sentence summary of the technology stack and architecture
2. 3-5 key insights about the website's technical implementation

Format as JSON:
{
  "summary": "...",
  "insights": ["...", "..."]
}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a technical analyst specializing in web technology detection. Provide concise, accurate analysis.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("Empty AI response")

    const parsed = JSON.parse(content) as { summary?: string; insights?: string[] }

    return {
      summary: parsed.summary ?? `Website built with ${technologies.map((t) => t.name).join(", ")}.`,
      insights: parsed.insights ?? [],
    }
  } catch (error) {
    console.error("OpenAI API error:", error)
    return {
      summary: `This website uses ${technologies.map((t) => t.name).join(", ")}.`,
      insights: ["AI analysis temporarily unavailable."],
    }
  }
}
