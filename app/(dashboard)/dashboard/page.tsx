'use client';
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const options: { [key: string]: { title: string; description: string; link: string } } = {
        board:
        {
            title: "Boards", description: "Manage your projects effectively, create the board and tasks necessary to succeed.",
            link: 'boards'
        },
        themePicker: {
            title: "Theme Picker", description: "Customize your theme",
            link: 'themePicker'
        },
        githubAnalytics: {
            title: "GitHub Analytics", description: "View your GitHub stats",
            link: 'githubAnalytics'
        }
    };
    const router = useRouter();
    const handleOptionClick = (link: string) => {
        router.push(`/dashboard/${link}`);
    }
    return (

        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Dashboard
            </h1>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                {Object.keys(options).map((option) => (
                    <div key={option} className="m4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer bg-card border-border  bg-surface  dark:bg-surface-dark"
                        onClick={() => handleOptionClick(options[option].link)}>
                        <h2 className="text-2xl font-semibold">{options[option].title}</h2>
                        <p className="mb-4">{options[option].description}</p>
                    </div>
                ))}
            </div>


        </main>


    );
}