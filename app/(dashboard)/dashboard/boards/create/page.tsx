'use client';

import CustomButton from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import CustomSelect from "@/components/ui/select";
import CustomTable from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateBoard() {
    const router = useRouter();

    const [state, setState] = useState<{
        description: string;
        name: string;
        customFields: { name: string; type: string; required: boolean; option: string }[];
    }>({
        description: '',
        name: '',
        customFields: [],
    });

    const [customField, setCustomField] = useState({
        name: '',
        type: '',
        required: false,
        option: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeCustomField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.currentTarget;
        const checked = (e.currentTarget as HTMLInputElement).checked;
        setCustomField((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
        console.log(name, value, type, checked);
    };

    const addCustomField = () => {
        console.log('Adding custom field:', customField);
        if (!customField.name || !customField.type) return;
        setState((prevState) => ({
            ...prevState,
            customFields: [...prevState.customFields, customField],
        }));
        setCustomField({ name: '', type: '', required: false, option: '' });
    };

    const clearCustomField = () => {
        setCustomField({ name: '', type: '', required: false, option: '' });
    };

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
                />

                {/* Description (full width) */}
                <CustomInput
                    placeholder="Description"
                    variant="default"
                    className="col-span-2 lg:col-span-3"
                    onChange={handleChange}
                    name="description"
                />

                <p className="col-span-2 lg:col-span-3 text-sm text-gray-500">
                    Default fields of each task: title, description, position, createdAt.
                    You can add custom fields below:
                </p>

                {/* Custom Field Builder */}
                <CustomInput
                    placeholder="Custom Field Name"
                    variant="default"
                    className="col-span-2 lg:col-span-3"
                    label="Field Name"
                    name="name"
                    onChange={handleChangeCustomField}
                    value={customField.name}
                />

                <CustomSelect
                    className="col-span-2 lg:col-span-3"
                    variant="default"
                    label="Field Type"
                    name="type"
                    onChange={handleChangeCustomField}
                    value={customField.type}
                >
                    <option value="">Select type</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                </CustomSelect>

                <CustomSelect
                    className="col-span-2 lg:col-span-3"
                    variant="default"
                    label="Field Option"
                    name="option"
                    onChange={handleChangeCustomField}
                    value={customField.option}
                >
                    <option value="">Select option</option>
                    <option value="select">Select</option>
                    <option value="multiselect">Multiselect</option>
                </CustomSelect>

                <div className="flex gap-4 items-center col-span-2 lg:col-span-3">
                    <CustomInput
                        type="checkbox"
                        variant="default"
                        label="Required"
                        name="required"
                        onChange={handleChangeCustomField}
                        checked={customField.required}
                    />
                    <CustomButton variant="primary" onClick={addCustomField}>
                        Add Field
                    </CustomButton>
                    <CustomButton variant="secondary" onClick={clearCustomField}>
                        Clear
                    </CustomButton>
                </div>
                {/* Display added custom fields */}
                <div className="col-span-2 lg:col-span-3">
                    <h2 className="text-2xl font-semibold mb-4">Added Custom Fields:</h2>
                    {state.customFields.length === 0 ? (
                        <p className="text-sm text-gray-500">No custom fields added yet.</p>
                    ) : (
                        <CustomTable rows={state.customFields} mapNull={{ required: 'No', option: 'N/A' }} />
                    )}

                </div>
            </div>

            <CustomButton
                variant="primary"
                onClick={() => {
                    console.log(state);
                }}
            >
                Create Board
            </CustomButton>
        </main>
    );
}
