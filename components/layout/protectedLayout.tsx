"use client";
import Header from "./header";
import { useState } from "react";
import Sidebar from "./sidebar";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (<div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header sideBarFunc={() => {
            setIsSidebarOpen((prev) => !prev)
        }} />

        <div className="flex flex-1">
            <Sidebar isSidebarOpen={isSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/30 p-8">{children}</main>
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-surface px-6 py-4 dark:bg-surface-dark">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">© 2025 Jose Gale. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Terms
                    </a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    </div>)

}