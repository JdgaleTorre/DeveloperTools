import { useState } from "react";
import CustomButton from "../ui/button";
import CustomInput from "../ui/input";
import CustomSelect from "../ui/select";
import CustomTable from "../ui/table";

export default function CreateCustomField() {
    const [customField, setCustomField] = useState({
        name: '',
        type: '',
        required: false,
        option: '',
    });

    const handleChangeCustomField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.currentTarget;
        const checked = (e.currentTarget as HTMLInputElement).checked;
        setCustomField((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
        console.log(name, value, type, checked);
    };

    const clearCustomField = () => {
        setCustomField({ name: '', type: '', required: false, option: '' });
    };


    const addCustomField = () => {
        console.log('Adding custom field:', customField);
        if (!customField.name || !customField.type) return;
        // setState((prevState) => ({
        //     ...prevState,
        //     customFields: [...prevState.customFields, customField],
        // }));
        setCustomField({ name: '', type: '', required: false, option: '' });
    };

    return (
        <div>
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

        </div>

    )
}