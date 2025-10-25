import * as React from "react"
import { cn } from "@/lib/utils"

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    variant?: "default" | "outline" | "filled"
    selectSize?: "sm" | "md" | "lg"
    error?: boolean
    label?: string
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
    ({ className, variant = "default", selectSize = "md", error = false, label, children, ...props }, ref) => {
        const baseStyles =
            `w-full rounded-md font-medium transition-colors focus:outline-none focus:ring-2 
            focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
            appearance-none dark:text-black`

        const variants = {
            default: "border border-input bg-background text-foreground",
            outline: "border-2 border-border bg-transparent text-foreground",
            filled: "border-0 bg-muted text-foreground",
        }

        const sizes = {
            sm: "h-8 px-3 py-1 text-sm",
            md: "h-10 px-4 py-2 text-base",
            lg: "h-12 px-5 py-3 text-lg",
        }


        const errorStyles = error ? "border-destructive focus:ring-destructive" : ""

        return (
            <div className="flex flex-col">
                {label && <label className="text-sm font-medium text-foreground">{label}</label>}
                <select
                    className={cn(baseStyles, variants[variant], sizes[selectSize], errorStyles, className)}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
            </div>
        )
    },
)

CustomSelect.displayName = "CustomSelect"

export default CustomSelect 
