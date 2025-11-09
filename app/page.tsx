"use client";
import { useRouter } from "next/navigation";
import { Brain, Kanban, Sparkles, Zap, Lock, Users } from "lucide-react";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/header";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
            {/* Header */}
            <Header sideBarFunc={() => { }} isAuthenticated={false} />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm">AI-Powered Project Management</span>
                        </div>
                        <h1 className="text-foreground mb-6">
                            Transform Ideas into <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Actionable Tasks</span> with AI
                        </h1>
                        <p className="text-muted-foreground mb-8 text-lg">
                            DevTools.AI combines intelligent task generation with powerful Kanban boards.
                            Describe your project in plain English and watch as AI creates a structured workflow in seconds.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                onClick={() => router.push('dashboard')}
                            >
                                Try it Now - Free
                            </Button>
                            <Button size="lg" variant="outline">
                                Watch Demo
                            </Button>
                        </div>
                        <div className="mt-8 flex items-center gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-accent rounded-full"></div>
                                Free forever plan
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl"></div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-background py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-foreground mb-4">Everything you need to manage projects smarter</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Powered by AI, designed for teams. DevTools.AI brings intelligence to every step of your workflow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-foreground mb-2">AI Task Generation</h3>
                            <p className="text-muted-foreground">
                                Describe your project in natural language. Our AI generates structured tasks with titles, descriptions, and priorities instantly.
                            </p>
                        </Card>

                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <Kanban className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-foreground mb-2">Kanban Boards</h3>
                            <p className="text-muted-foreground">
                                Drag-and-drop task management with customizable columns. Move tasks between statuses with smooth, intuitive interactions.
                            </p>
                        </Card>

                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-foreground mb-2">Custom Workflows</h3>
                            <p className="text-muted-foreground">
                                Create custom status columns with color coding. Design workflows that match your team's unique process.
                            </p>
                        </Card>

                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-foreground mb-2">Real-Time Updates</h3>
                            <p className="text-muted-foreground">
                                Changes sync instantly across your team. See updates as they happen with optimistic UI for lightning-fast interactions.
                            </p>
                        </Card>

                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-foreground mb-2">Secure Authentication</h3>
                            <p className="text-muted-foreground">
                                Sign in securely with GitHub OAuth. Your data is protected with enterprise-grade security.
                            </p>
                        </Card>

                        <Card className="p-6 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-foreground mb-2">Team Collaboration</h3>
                            <p className="text-muted-foreground">
                                Share boards with your team. Collaborate in real-time with comments, assignments, and notifications.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-foreground mb-4">From idea to execution in three simple steps</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                1
                            </div>
                            <h3 className="text-foreground mb-2">Describe Your Project</h3>
                            <p className="text-muted-foreground">
                                Open the AI chat and describe what you want to build. Be as detailed or as brief as you like.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                2
                            </div>
                            <h3 className="text-foreground mb-2">Review AI Suggestions</h3>
                            <p className="text-muted-foreground">
                                AI generates a complete task breakdown. Accept, edit, or regenerate tasks until they're perfect.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                3
                            </div>
                            <h3 className="text-foreground mb-2">Start Building</h3>
                            <p className="text-muted-foreground">
                                Tasks appear on your Kanban board. Drag, drop, and track progress as your team brings the project to life.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-white mb-6">Ready to transform how you manage projects?</h2>
                    <p className="text-blue-100 text-lg mb-8">
                        Join thousands of teams using AI to plan smarter and ship faster.
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push('dashboard')}
                    >
                        Get Started Free
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white">DevTools.AI</span>
                            </div>
                            <p className="text-sm">
                                AI-powered project management for modern teams.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 dark:border-slate-900 mt-8 pt-8 text-sm text-center">
                        © 2025 DevTools.AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}