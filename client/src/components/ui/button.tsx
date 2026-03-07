import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "accent" | "sage";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-[#2C2A25] text-[#FDFBF7] hover:bg-[#1A1916] shadow-md": variant === "default",
            "bg-[#D97757] text-white hover:bg-[#C26547] shadow-md": variant === "accent",
            "bg-[#5A6B5D] text-white hover:bg-[#4A594D] shadow-md": variant === "sage",
            "border border-[#EDE8E0] bg-white hover:bg-[#FDFBF7] text-[#2C2A25]": variant === "outline",
            "bg-[#F4EBE6] text-[#D97757] hover:bg-[#EBDCD3]": variant === "secondary",
            "hover:bg-[#EDE8E0] hover:text-[#2C2A25] text-[#5A6B5D]": variant === "ghost",
            "h-10 px-6 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-10 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
