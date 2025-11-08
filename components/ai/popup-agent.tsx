"use client"

import type React from "react"


import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomInput from "../ui/input";
import CustomButton from "../ui/button";
import { Bot, BotMessageSquare, Send, User, X } from "lucide-react";


type AIAgentPopupProps<T> = {
    label: string
    placeholder: string
    apiEndPoint: string
    responseHandler: (data: T, onAccept: () => void, onReject: () => void) => React.ReactNode
}

const mockTaskResponse = {
    tasks: [
        {
            title: "Define project goals",
            description: "Clarify the objectives and deliverables for the new project."
        },
        {
            title: "Create project roadmap",
            description: "Break down the project into milestones and assign timelines."
        },
        {
            title: "Set up development environment",
            description: "Install necessary tools, libraries, and configure the workspace."
        },
        {
            title: "Implement core features",
            description: "Start coding the main functionalities as per the specifications."
        },
        {
            title: "Testing and QA",
            description: "Write tests, perform manual QA, and ensure everything works as expected."
        }
    ]
};


export function AIAgentPopup<T>(
    {
        label,
        placeholder,
        apiEndPoint,
        responseHandler
    }: AIAgentPopupProps<T>) {

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [responseContent, setResponseContent] = useState<React.ReactNode | null>(null);
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
            setResponseContent("Sorry, I encountered an error. Please try again.")
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-destructive-foreground"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                ) : (
                    <BotMessageSquare className="text-white" />
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-32 right-6 z-40 flex h-[500px] w-[380px] flex-col rounded-lg border border-border bg-card shadow-2xl">
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
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">AI is thinking...</p>
                            </div>
                        </div>
                    )}

                    {/* Preview Section */}
                    {showPreview && !isLoading && response && (
                        <div className="space-y-4 border border-border bg-card p-6 overflow-y-auto
                        scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-background dark:scrollbar-track-background-dark hover:scrollbar-thumb-accent rounded-xl">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">Response Preview</h3>
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
