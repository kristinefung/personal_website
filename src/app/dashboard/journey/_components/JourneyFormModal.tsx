import React, { useState, useEffect } from "react";
import Modal from "@/component/Modal";
import JourneyFormFields from "./JourneyFormFields";
import { JourneyResponse } from "@/types/api";
import { journeyFormInputSchema } from "@/lib/validation/schemas";

interface JourneyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (journeyData: any) => void;
    mode: "ADD" | "EDIT";
    journey?: JourneyResponse | null;
}

interface FormData {
    title: string;
    institution: string;
    description: string;
    startYear: string;
    endYear: string;
    isCurrent: boolean;
}

interface FormErrors {
    title?: string;
    institution?: string;
    description?: string;
    startYear?: string;
    endYear?: string;
    isCurrent?: string;
}

const emptyForm: FormData = {
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
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setErrors({});
    }, [isOpen, mode, journey]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
                // Clear end year when isCurrent is checked
                ...(name === "isCurrent" && checked ? { endYear: "" } : {})
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        const validationResult = journeyFormInputSchema.safeParse(formData);

        if (!validationResult.success) {
            const newErrors: FormErrors = {};
            validationResult.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FormErrors;
                if (fieldName) {
                    newErrors[fieldName] = issue.message;
                }
            });
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const data = {
                ...formData,
                startYear: formData.startYear ? parseInt(formData.startYear, 10) : undefined,
                endYear: formData.isCurrent ? undefined : (formData.endYear ? parseInt(formData.endYear, 10) : undefined),
                isCurrent: !!formData.isCurrent,
            };
            onSave(data);
            onClose();
        } catch (error) {
            console.error('Error saving journey:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === "ADD" ? "Add Journey" : "Edit Journey"}>
            <form autoComplete="off" onSubmit={handleSubmit} noValidate className="space-y-4">
                <JourneyFormFields
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    isSubmitting={isSubmitting}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : (mode === "ADD" ? "Create Journey" : "Save Journey")}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default JourneyFormModal; 