"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ArchNode {
  id: string
  label: string
  category: "frontend" | "backend" | "infra" | "analytics" | "css" | "other"
  x: number
  y: number
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]",
  backend: "border-[#10b981] bg-[#10b981]/10 text-[#10b981]",
  infra: "border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]",
  analytics: "border-[#eab308] bg-[#eab308]/10 text-[#eab308]",
  css: "border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6]",
  other: "border-[#a1a1aa] bg-[#a1a1aa]/10 text-[#a1a1aa]",
}

interface ArchitectureDiagramProps {
  technologies: { name: string; category: string }[]
  hosting?: string | null
  cdn?: string | null
}

export function ArchitectureDiagram({ technologies, hosting, cdn }: ArchitectureDiagramProps) {
  const frontend = technologies.filter(
    (t) =>
      t.category === "Framework" ||
      t.category === "Library" ||
      t.category === "Language" ||
      t.category === "Animation Library" ||
      t.category === "3D Library" ||
      t.category === "State Management",
  )
  const backend = technologies.filter(
    (t) => t.category === "CMS" || t.category === "Payment" || t.category === "Auth",
  )
  const infra = technologies.filter(
    (t) => t.category === "Hosting" || t.category === "CDN" || t.category === "Build Tool",
  )
  const analytics = technologies.filter((t) => t.category === "Analytics")
  const css = technologies.filter(
    (t) => t.category === "CSS Framework" || t.category === "CSS" || t.category === "Font Service" || t.category === "Icon Library",
  )

  const nodes: ArchNode[] = []
  let idx = 0

  const addNodes = (items: { name: string }[], category: ArchNode["category"], startX: number) => {
    items.forEach((item, i) => {
      nodes.push({
        id: `node-${idx++}`,
        label: item.name,
        category,
        x: startX,
        y: 20 + i * 60,
      })
    })
  }

  addNodes(frontend, "frontend", 10)
  addNodes(css, "css", 10)
  addNodes(infra, "infra", 50)
  addNodes(backend, "backend", 50)
  addNodes(analytics, "analytics", 50)

  if (hosting && !technologies.find((t) => t.name === hosting)) {
    addNodes([{ name: hosting }], "infra", 50)
  }
  if (cdn && !technologies.find((t) => t.name === cdn)) {
    addNodes([{ name: cdn }], "infra", 50)
  }

  if (nodes.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <div className="relative mx-auto h-[200px] min-w-[500px] max-w-2xl">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 200" fill="none">
          {nodes.slice(0, -1).map((node, i) => {
            const next = nodes[i + 1]
            if (!next) return null
            return (
              <motion.line
                key={`line-${i}`}
                x1={node.x}
                y1={node.y + 14}
                x2={next.x}
                y2={next.y + 14}
                stroke="#1f1f1f"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              />
            )
          })}
        </svg>

        <div className="absolute inset-0 flex flex-wrap items-start justify-center gap-3 p-4">
          {frontend.length > 0 && (
            <CategoryGroup label="Frontend" color="border-[#6366f1]">
              {frontend.map((t) => (
                <NodeBadge key={t.name} label={t.name} category="frontend" />
              ))}
            </CategoryGroup>
          )}
          {css.length > 0 && (
            <CategoryGroup label="Design" color="border-[#8b5cf6]">
              {css.map((t) => (
                <NodeBadge key={t.name} label={t.name} category="css" />
              ))}
            </CategoryGroup>
          )}
          {infra.length > 0 && (
            <CategoryGroup label="Infrastructure" color="border-[#06b6d4]">
              {infra.map((t) => (
                <NodeBadge key={t.name} label={t.name} category="infra" />
              ))}
            </CategoryGroup>
          )}
          {backend.length > 0 && (
            <CategoryGroup label="Backend" color="border-[#10b981]">
              {backend.map((t) => (
                <NodeBadge key={t.name} label={t.name} category="backend" />
              ))}
            </CategoryGroup>
          )}
          {analytics.length > 0 && (
            <CategoryGroup label="Analytics" color="border-[#eab308]">
              {analytics.map((t) => (
                <NodeBadge key={t.name} label={t.name} category="analytics" />
              ))}
            </CategoryGroup>
          )}
        </div>
      </div>
    </div>
  )
}

function CategoryGroup({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("rounded-xl border p-3", color, "bg-[#0a0a0a]")}
    >
      <p className="mb-2 text-xs font-medium tracking-wider uppercase opacity-60">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </motion.div>
  )
}

function NodeBadge({ label, category }: { label: string; category: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-block rounded-md border px-2 py-0.5 text-xs font-medium",
        CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other,
      )}
    >
      {label}
    </motion.span>
  )
}
