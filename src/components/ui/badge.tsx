import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[#1f1f1f] text-[#a1a1aa]",
        primary: "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20",
        success: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20",
        warning: "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20",
        error: "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20",
        accent: "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20",
        gradient: "gradient-border bg-[#121212] text-[#fafafa]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
