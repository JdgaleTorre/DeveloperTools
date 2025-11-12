import { cn } from "@/lib/utils";
import { ChartSpline, Home, KanbanSquare, LayoutDashboard, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    return (
        <aside
            className={
                cn(
                    "bg-surface transition-all duration-300 dark:bg-surface-dark",
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
                    <KanbanSquare />
                    Boards
                </Link>
                {/* <a
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
                </a> */}

            </nav>
        </aside >
    )
}