'use client';

import CustomButton from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function CreateBoard() {
    const [state, setState] = useState<{
        description: string;
        name: string;
    }>({
        description: '',
        name: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const clearCustomField = () => {
        setState({
            description: '',
            name: '',
        });
    }

    const { data } = trpc.hello.useQuery({ text: 'from tRPC' });

    return (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Create a new Board
            </h1>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-3 w-full max-w-3xl">
                {/* Board Name */}
                <CustomInput
                    placeholder="Board Name"
                    variant="default"
                    name="name"
                    onChange={handleChange}
                    label="Board Name"
                />

                {/* Description (full width) */}
                <CustomInput
                    placeholder="Description"
                    variant="default"
                    className="col-span-2 lg:col-span-3"
                    onChange={handleChange}
                    name="description"
                    label="Description"
                />


                <CustomButton
                    variant="primary"
                    onClick={() => {
                        console.log(state);
                    }}
                >
                    Create Board
                </CustomButton>
                <CustomButton variant="secondary" onClick={clearCustomField}>
                    Clear
                </CustomButton>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                {data ? <p>{data.greeting}</p> : <p>Loading...</p>}
            </div>
        </main>
    );
}
