'use client';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                    <Card className="cursor-pointer" key={options[option].title} onClick={() => handleOptionClick(options[option].link)}>
                        <CardHeader>
                            <CardTitle>
                                {options[option].title}
                            </CardTitle>
                        </CardHeader>
                        <CardDescription className="mx-4 mb-4">
                            {options[option].description}
                        </CardDescription>
                    </Card>

                ))}
            </div>


        </main>


    );
}