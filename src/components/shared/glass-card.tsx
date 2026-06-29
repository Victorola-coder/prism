"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, hover = true, glow = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "rounded-xl border border-[#1f1f1f] bg-[#121212]/80 p-6",
        hover && "transition-all duration-300 hover:border-[#2a2a2a] hover:bg-[#1a1a1a]/80",
        glow && "shadow-[0_0_30px_rgba(99,102,241,0.06)]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
