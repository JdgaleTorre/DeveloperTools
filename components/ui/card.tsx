import React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "bordered" | "elevated" | "flat"
    hover?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> { }

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

const cardVariants = {
    default: "bg-card dark:bg-card-dark border border-border shadow-sm",
    bordered: "bg-card dark:bg-card-dark border-2 border-border",
    elevated: "bg-card dark:bg-card-dark border border-border shadow-lg",
    flat: "bg-card dark:bg-card-dark",
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", hover = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg transition-all duration-200",
                    cardVariants[variant],
                    hover && "hover:shadow-md hover:scale-[1.02]",
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        )
    },
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props}>
                {children}
            </div>
        )
    },
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-2xl font-semibold leading-none tracking-tight text-foreground", className)}
                {...props}
            >
                {children}
            </h3>
        )
    },
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
                {children}
            </p>
        )
    },
)
CardDescription.displayName = "CardDescription"

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({ className, children, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
            {children}
        </div>
    )
})
CardBody.displayName = "CardBody"

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("flex items-center gap-2 p-6 pt-0", className)} {...props}>
                {children}
            </div>
        )
    },
)
CardFooter.displayName = "CardFooter"
