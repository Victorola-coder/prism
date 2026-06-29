import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  variant?: "primary" | "white"
}

export function GradientText({
  children,
  className,
  as: Tag = "span",
  variant = "white",
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        variant === "white"
          ? "bg-gradient-to-br from-[#fafafa] via-[#e4e4e7] to-[#a1a1aa] bg-clip-text text-transparent"
          : "bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
