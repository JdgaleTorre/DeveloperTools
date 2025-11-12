'use client';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const options: { [key: string]: { title: string; description: string; link: string } } = {
        board: {
            title: "Boards",
            description:
                "Organize your work visually with customizable boards. Create, prioritize, and track tasks effortlessly across different project stages.",
            link: "boards",
        },
    };

    const comingSoon: { [key: string]: { title: string; description: string; link: string } } = {
        themePicker: {
            title: "Theme Picker",
            description:
                "Personalize your workspace with custom themes. Switch between light and dark modes or design your own color palette to match your style.",
            link: "themePicker",
        },
        githubAnalytics: {
            title: "GitHub Analytics",
            description:
                "Gain insights into your GitHub activity. Track commits, pull requests, and repository growth with intuitive charts and visual metrics.",
            link: "githubAnalytics",
        },
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

            <h3>Coming Soon</h3>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
                {Object.keys(comingSoon).map((option) => (
                    <Card key={comingSoon[option].title}>
                        <CardHeader>
                            <CardTitle>
                                {comingSoon[option].title}
                            </CardTitle>
                        </CardHeader>
                        <CardDescription className="mx-4 mb-4">
                            {comingSoon[option].description}
                        </CardDescription>
                    </Card>

                ))}
            </div>


        </main>


    );
}