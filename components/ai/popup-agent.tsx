"use client"

import type React from "react"


import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomInput from "../ui/input";
import CustomButton from "../ui/button";
import { BotMessageSquare, X } from "lucide-react";
import { mockTaskResponse } from "@/lib/ai";


type AIAgentPopupProps<T> = {
    label: string
    labelPreview: string
    placeholder: string
    apiEndPoint: string
    responseHandler: (data: T, onAccept: () => void, onReject: () => void) => React.ReactNode
}

export function AIAgentPopup<T>(
    {
        label,
        labelPreview,
        placeholder,
        apiEndPoint,
        responseHandler
    }: AIAgentPopupProps<T>) {

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [response, setResponse] = useState<T | null>(mockTaskResponse as T);

    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(true);


    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        setIsLoading(true)
        setShowPreview(false)

        try {
            const res = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            })

            if (!res.ok) throw new Error("Failed to get response")

            const data = await res.json()
            console.log("[AI Response]", data)

            setResponse(data)
            setShowPreview(true)
        } catch (error) {
            console.error("Error:", error)
            setResponse(null)
            setShowPreview(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAccept = (data?: T) => {
        // Handle accept action - could save to state, send to backend, etc.
        console.log("[v0] Accepted response:", data)

        setShowPreview(false)
        setInput("")
        setResponse(null)
    }

    const handleReject = () => {
        // Handle reject action
        console.log("[v0] Rejected response")
        setShowPreview(false)
        setResponse(null)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-14 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
                    isOpen ? "bg-destructive" : "bg-primary",
                )}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <X />
                ) : (
                    <BotMessageSquare className="text-white" />
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-32 right-6 z-40 flex h-[500px] w-[380px] flex-col rounded-lg border border-border bg-card dark:bg-card-dark shadow-2xl">
                    <div className="space-y-2 p-4">
                        <label htmlFor="ai-input" className="text-sm font-medium text-foreground">
                            {label}
                        </label>
                        <div className="flex gap-2">
                            <CustomInput
                                // id="ai-input"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder={placeholder}
                                disabled={isLoading} />

                            <CustomButton onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                                {isLoading ? "Generating..." : "Send"}
                            </CustomButton>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="rounded-lg border border-border bg-card dark:bg-card-dark p-6">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">AI is thinking...</p>
                            </div>
                        </div>
                    )}

                    {/* Preview Section */}
                    {showPreview && !isLoading && response && (
                        <div className="space-y-4 border border-border bg-card dark:bg-card-dark p-2 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-background dark:scrollbar-track-background-dark hover:scrollbar-thumb-accent">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">{labelPreview}</h3>
                                <div className="rounded-md bg-muted p-4">
                                    <div className="text-sm leading-relaxed text-foreground">{
                                        responseHandler(
                                            response,
                                            () => handleAccept(response),
                                            handleReject
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            )
            }
        </>
    )
}
