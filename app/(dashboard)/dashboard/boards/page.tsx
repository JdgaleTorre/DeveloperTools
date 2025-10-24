'use client';
import { useRouter } from "next/navigation";
export default function Dashboard() {

    const router = useRouter();

    return (

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Boards
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">

                <div className="m4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    onClick={() => router.push('/dashboard/boards/create')}>
                    <h2 className="text-2xl font-semibold">Create Board</h2>
                    <p className="mb-4">Create a new board to manage your tasks.</p>
                </div>

            </div>


        </main>


    );
}