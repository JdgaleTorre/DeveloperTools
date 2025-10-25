'use client';

import CustomButton from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { useToast } from "@/components/ui/toast"
import { useRouter } from "next/navigation";

export default function CreateBoard() {
    const { addToast } = useToast();
    const router = useRouter();
    const [state, setState] = useState<{
        description: string;
        name: string;
    }>({
        description: '',
        name: '',
    });


    const { mutate, isPending } = trpc.board.insert.useMutation({
        onSuccess: async (data) => {
            addToast({
                title: "Success",
                description: "Board created successfully",
                variant: "success",
            });
            router.push(`/dashboard/boards/${data[0].id}`);
        },
        onError: (error) => {
            addToast({
                title: "Error",
                description: "Failed to create board",
                variant: "error",
            });
        },
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
                    value={state.name}
                />

                {/* Description (full width) */}
                <CustomInput
                    placeholder="Description"
                    variant="default"
                    className="col-span-2 lg:col-span-3"
                    onChange={handleChange}
                    name="description"
                    label="Description"
                    value={state.description}
                />


                <CustomButton
                    variant="primary"
                    onClick={() => {
                        mutate({ name: state.name, description: state.description });
                    }}
                    disabled={isPending}
                >
                    Create Board
                </CustomButton>
                <CustomButton variant="secondary" onClick={clearCustomField} disabled={isPending}>
                    Clear
                </CustomButton>
            </div>


        </main>
    );
}
