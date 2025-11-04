import { cn } from "@/lib/utils";
import { ChartSpline, Home, LayoutDashboard, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    return (
        <aside
            className={
                cn(
                    "bg-background transition-all duration-300 dark:bg-background-dark",
                    isSidebarOpen ? "w-64 border-r border-border" : "w-0 overflow-hidden",
                )
            }
        >
            <nav className="flex flex-col gap-1 p-4">
                <Link href="/dashboard/"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-primary-foreground">
                    <Home />
                    Home
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary-foreground"
                    href="/dashboard/boards">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trello-icon lucide-trello">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <rect width="3" height="9" x="7" y="7" />
                        <rect width="3" height="5" x="14" y="7" />
                    </svg>
                    Boards
                </Link>
                <a
                    href="#"

                >

                </a>
                <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary-foreground"
                >
                    <LayoutDashboardIcon />
                    Theme Picker
                </a>
                <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary-foreground"
                >
                    <ChartSpline />
                    GitHub
                </a>

            </nav>
        </aside >
    )
}