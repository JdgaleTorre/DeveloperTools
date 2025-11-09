"use client";

import { signIn, signOut } from "next-auth/react";
import { ThemeToggle } from "../ui/theme-toggle";
import { Brain, Menu, X } from "lucide-react";
import Button from "../ui/button";
import { Session } from "next-auth";

export default function Header({ sideBarFunc, isAuthenticated, session, isSidebarOpen }:
    { sideBarFunc: () => void, isAuthenticated: boolean, session?: Session, isSidebarOpen?: boolean }) {

    function getInitials(fullName: string) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) {
            // Only one name → return first two letters
            return parts[0].substring(0, 2).toUpperCase();
        }

        // More than one → first letter of first two words
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    if (!isAuthenticated) {
        return (
            <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-foreground">DevTools.AI</span>
                    </div>
                    <nav className="flex items-center gap-2">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors px-3">Features</a>
                        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors px-3">How it Works</a>
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            onClick={() => signIn()}
                        >
                            Sign In
                        </Button>
                    </nav>
                </div>
            </header>
        )
    }



    return (<header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => sideBarFunc()}
                className="lg:hidden"
            >
                {isSidebarOpen ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground cursor-pointer" onClick={() => { }}>
                    DevTools.AI
                </span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm">
                {getInitials(session?.user.name ?? "")}
            </div>
        </div>
    </header >)

}