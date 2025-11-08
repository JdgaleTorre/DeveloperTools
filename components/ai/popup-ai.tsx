"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import CustomInput from "../ui/input"
import CustomButton from "../ui/button"
import { Bot, BotMessageSquare, Send, User, X } from "lucide-react"

export function AIChatPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, sendMessage, status } = useChat<UIMessage>({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const input = formData.get("message") as string

        if (!input.trim()) return

        sendMessage({ text: input })
        e.currentTarget.reset()
        inputRef.current?.focus()
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
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                            <Bot className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                            <p className="text-xs text-muted-foreground">{status === "streaming" ? "Thinking..." : "Online"}</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Close chat"
                        >
                            <X />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {messages.length === 0 && (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
                                        className="text-muted-foreground"
                                    >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Start a conversation</h4>
                                    <p className="text-xs text-muted-foreground">Ask me anything!</p>
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
                            >
                                {message.role === "assistant" && (
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-primary-foreground"
                                        >
                                            <path d="M12 8V4H8" />
                                            <rect width="16" height="12" x="4" y="8" rx="2" />
                                            <path d="M2 14h2" />
                                            <path d="M20 14h2" />
                                            <path d="M15 13v2" />
                                            <path d="M9 13v2" />
                                        </svg>
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-lg px-3 py-2",
                                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                                    )}
                                >
                                    {message.parts.map((part, index) => {
                                        if (part.type === "text") {
                                            return (
                                                <p key={index} className="whitespace-pre-wrap break-words text-xs">
                                                    {part.text}
                                                </p>
                                            )
                                        }
                                        return null
                                    })}
                                </div>

                                {message.role === "user" && (
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                                        <User />
                                    </div>
                                )}
                            </div>
                        ))}

                        {status === "streaming" && messages[messages.length - 1]?.role === "user" && (
                            <div className="flex gap-2">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary-foreground"
                                    >
                                        <path d="M12 8V4H8" />
                                        <rect width="16" height="12" x="4" y="8" rx="2" />
                                        <path d="M2 14h2" />
                                        <path d="M20 14h2" />
                                        <path d="M15 13v2" />
                                        <path d="M9 13v2" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2">
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]"></div>
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground"></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="border-t border-border bg-muted/50 p-3">
                        <div className="flex items-center gap-2">
                            <CustomInput
                                ref={inputRef}
                                name="message"
                                placeholder="Type your message..."
                                disabled={status === "streaming"}
                                inputSize="sm"
                                className="flex-1"
                                autoComplete="off"
                            />
                            <CustomButton type="submit" disabled={status === "streaming"} size="sm">
                                {status === "streaming" ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-spin"
                                    >
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                ) : (
                                    <Send />
                                )}
                            </CustomButton>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
