import React, { useState, useEffect } from "react";
import Modal from "@/component/Modal";
import JourneyFormFields from "./JourneyFormFields";
import { JourneyResponse } from "@/types/api";

interface JourneyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (journeyData: any) => void;
    mode: "ADD" | "EDIT";
    journey?: JourneyResponse | null;
}

const emptyForm = {
    title: "",
    institution: "",
    description: "",
    startYear: "",
    endYear: "",
    isCurrent: false,
};

const JourneyFormModal: React.FC<JourneyFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    mode,
    journey,
}) => {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (mode === "EDIT" && journey) {
            setFormData({
                title: journey.title || "",
                institution: journey.institution || "",
                description: journey.description || "",
                startYear: journey.startYear ? journey.startYear.toString() : "",
                endYear: journey.endYear ? journey.endYear.toString() : "",
                isCurrent: journey.isCurrent || false,
            });
        } else if (mode === "ADD") {
            setFormData(emptyForm);
        }
    }, [isOpen, mode, journey]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            startYear: formData.startYear ? parseInt(formData.startYear, 10) : undefined,
            endYear: formData.isCurrent ? undefined : (formData.endYear ? parseInt(formData.endYear, 10) : undefined),
            isCurrent: !!formData.isCurrent,
        };
        onSave(data);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === "ADD" ? "Add Journey" : "Edit Journey"}>
            <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
                <JourneyFormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        {mode === "ADD" ? "Create Journey" : "Save Journey"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default JourneyFormModal; 