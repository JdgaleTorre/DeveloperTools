import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "ghost-destructive"
    size?: "sm" | "md" | "lg"
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles =
            `flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer transition-all duration-200
            hover:shadow-md hover:scale-[1.02]`

        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            "ghost-destructive": "text-destructive-foreground hover:bg-destructive/90",
        }

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
        }

        return (
            <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
                {children}
            </button>
        )
    },
)

CustomButton.displayName = "CustomButton"

export default CustomButton 
