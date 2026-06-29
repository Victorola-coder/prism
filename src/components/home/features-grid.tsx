"use client"

import { motion } from "framer-motion"
import { Layers, Zap, Palette, Sparkles, Network, Search } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { FEATURES } from "@/lib/constants"

const iconMap = {
  layers: Layers,
  zap: Zap,
  palette: Palette,
  sparkles: Sparkles,
  network: Network,
  search: Search,
}

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold text-[#fafafa] sm:text-4xl">
          Everything you need to know
        </h2>
        <p className="mx-auto max-w-xl text-[#a1a1aa]">
          From tech stack to performance, design to infrastructure — get a complete picture in seconds.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="group">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1]/10 text-[#6366f1] transition-colors group-hover:bg-[#6366f1]/20">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#fafafa]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#a1a1aa]">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
