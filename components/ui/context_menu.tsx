"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { useEffect, useRef, useState } from "react"

export interface ContextMenuItem {
    label: string
    icon?: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    divider?: boolean
    shortcut?: string
}

export interface ContextMenuProps {
    items: ContextMenuItem[]
    children: React.ReactNode
    className?: string
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPosition({
                x: rect.left,
                y: rect.bottom + 4,
            })
        }

        setIsOpen(!isOpen)
    }

    const handleItemClick = (item: ContextMenuItem) => {
        if (!item.disabled && item.onClick) {
            item.onClick()
        }
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen && menuRef.current) {
            const menu = menuRef.current
            const rect = menu.getBoundingClientRect()
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            let newX = position.x
            let newY = position.y

            if (rect.right > viewportWidth) {
                newX = viewportWidth - rect.width - 8
            }

            if (rect.bottom > viewportHeight) {
                newY = position.y - rect.height - 8
            }

            if (newX !== position.x || newY !== position.y) {
                setPosition({ x: newX, y: newY })
            }
        }
    }, [isOpen, position.x, position.y])

    return (
        <>
            <div ref={triggerRef} onClick={handleTriggerClick} className="inline-block">
                {children}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={cn(
                        "fixed z-50 min-w-[200px] rounded-lg border border-border bg-background shadow-lg",
                        "animate-in fade-in-0 zoom-in-95",
                        className,
                    )}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                    }}
                >
                    <div className="p-1">
                        {items.map((item, index) => {
                            if (item.divider) {
                                return <div key={index} className="my-1 h-px bg-border" />
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleItemClick(item)}
                                    disabled={item.disabled}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-muted",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                                        item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                                    )}
                                >
                                    {item.icon && <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>}
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.shortcut && <span className="text-xs text-muted-foreground">{item.shortcut}</span>}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
