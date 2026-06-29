import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#1f1f1f] bg-[#121212] px-4 py-2 text-sm text-[#fafafa] placeholder:text-[#52525b] transition-all duration-200",
          "focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_20px_rgba(99,102,241,0.08)]",
          "hover:border-[#2a2a2a]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
