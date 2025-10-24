'use client';
import { CustomButton } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
export default function Dashboard() {

    const router = useRouter();

    return (

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Create a new Board
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                <CustomInput placeholder="Board Name" variant="default" /> 
                <CustomInput placeholder="Description" variant="default" />
                <CustomButton variant="primary">Create Board</CustomButton>
            </div>


        </main>


    );
}