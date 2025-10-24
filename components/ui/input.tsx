import { cn } from "@/lib/utils"
import { type InputHTMLAttributes, forwardRef } from "react"

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "filled"
  inputSize?: "sm" | "md" | "lg"
  error?: boolean
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, variant = "default", inputSize = "md", error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styles
          "w-full rounded-md font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 ",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Variant styles
          variant === "default" && [
            "border border-input bg-background text-foreground",
            "placeholder:text-muted-foreground",
            "focus:ring-ring focus:ring-gray-500",
          ],
          variant === "outline" && [
            "border-2 border-border bg-transparent text-foreground",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-primary",
          ],
          variant === "filled" && [
            "border-0 bg-muted text-foreground",
            "placeholder:text-muted-foreground",
            "focus:bg-background focus:ring-ring",
          ],

          // Size styles
          inputSize === "sm" && "h-8 px-3 py-1 text-sm",
          inputSize === "md" && "h-10 px-4 py-2 text-base",
          inputSize === "lg" && "h-12 px-5 py-3 text-lg",

          // Error state
          error && "border-destructive focus:ring-destructive",

          className,
        )}
        {...props}
      />
    )
  },
)

CustomInput.displayName = "CustomInput"
