"use client";
import CustomButton from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Home() {
    const router = useRouter();

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl font-bold text-center sm:text-left">
                    Welcome to Developer Tools!
                </h1>
                <p className="text-lg text-gray-600 max-w-xl text-center sm:text-left">
                    This is a collection of tools to help developers be more productive.
                    More tools coming soon!
                </p>

                <div className="flex flex-col gap-[16px]">
                    <CustomButton onClick={() => signIn()} variant="primary">Sign In</CustomButton>
                </div>




            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <span className="text-sm text-gray-500">© 2025 Jose Gale</span>
            </footer>
        </div>
    );
}