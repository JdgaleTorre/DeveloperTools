"use client";
import Header from "./header";
import { useState } from "react";
import Sidebar from "./sidebar";
import { Session } from "next-auth";

export default function ProtectedLayout({ children, session }: Readonly<{ children: React.ReactNode; session: Session }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (<div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header sideBarFunc={() => {
            setIsSidebarOpen((prev) => !prev)
        }}
            isAuthenticated
            session={session}
            isSidebarOpen={isSidebarOpen} />

        <div className="flex flex-1">
            <Sidebar isSidebarOpen={isSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/30 lg:p-4 p-2">
                <div className="">

                    {children}
                </div>
            </main>
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