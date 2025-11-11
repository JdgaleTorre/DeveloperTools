"use client"

import type React from "react"


import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Loader2, Send, Sparkles, X } from "lucide-react";
import Button from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";


type AIAgentPopupProps<T> = {
    apiEndPoint: string,
    responseHandler: (data: T, onAccept: () => void, onReject: () => void) => React.ReactNode,
    firstMessage: string,
    responseMessage: (data: T) => string;
}

export function AIAgentPopup<T>(
    {
        apiEndPoint,
        responseHandler,
        firstMessage,
        responseMessage,

    }: AIAgentPopupProps<T>) {

    const [isOpen, setIsOpen] = useState(false);
    const [response, setResponse] = useState<T | null>();
    const [showPreview, setShowPreview] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        setChatHistory([
            {
                role: 'assistant',
                content: firstMessage
            }
        ])
    }, [firstMessage])


    const handleSendMessage = async () => {
        if (!prompt.trim() || isLoading) return

        setIsLoading(true);
        setShowPreview(false);
        setChatHistory(prev => [...prev, { role: 'user', content: prompt }]);

        try {
            const res = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt }),
            })

            if (!res.ok) throw new Error("Failed to get response")

            const data = await res.json()

            setResponse(data)

            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: responseMessage(data)
            }]);
            setShowPreview(true)
        } catch (error) {
            setResponse(null)
            setShowPreview(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAccept = (data?: T) => {

        setShowPreview(false)
        setPrompt("")
        setResponse(null)
    }

    const handleReject = () => {
        // Handle reject action
        setShowPreview(false)
        setResponse(null)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <Button
                size="lg"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-14 right-6 z-50 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/50",
                )}
            >

                <Sparkles className="w-5 h-5 mr-2" />
                AI Agent

            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-3xl h-[600px] flex flex-col bg-card shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-foreground">AI Project Assistant</h2>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Chat history */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatHistory.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-lg ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-foreground'
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating tasks...
                                    </div>
                                </div>
                            )}

                            {/* Preview */}
                            {showPreview && !isLoading && response && (

                                <div className="text-sm leading-relaxed text-foreground">{
                                    responseHandler(
                                        response,
                                        () => handleAccept(response),
                                        handleReject
                                    )}
                                </div>

                            )}
                        </div>

                        {/* Input area */}
                        <div className="p-4 border-t border-slate-200">
                            <div className="flex gap-2">
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Describe your project... (e.g., 'Build a recipe sharing app with user profiles and favorites')"
                                    className="resize-none"
                                    rows={3}
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!prompt.trim() || isLoading}
                                    size="sm"
                                    className="h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Press Enter to send, Shift+Enter for new line
                            </p>
                        </div>
                    </Card>
                </div>


            )
            }
        </>
    )
}
