"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";
import Checkbox from "@/component/form/Checkbox";
import Modal from "@/component/Modal";

interface AddJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (journeyData: any) => void;
}

export default function AddJourneyModal({ isOpen, onClose, onSave }: AddJourneyModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        institution: "",
        description: "",
        startYear: "",
        endYear: "",
        isCurrent: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <Modal isOpen={isOpen} onClose={onClose} title="Add Journey">
            <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <TextField
                        cssStyle="ADMIN"
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        label="Title"
                        required
                    />
                </div>
                <div>
                    <TextField
                        cssStyle="ADMIN"
                        type="text"
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        label="Institution"
                        required
                    />
                </div>
                <div>
                    <TextArea
                        cssStyle="ADMIN"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        label="Description"
                        rows={3}
                    />
                </div>
                <div>
                    <TextField
                        cssStyle="ADMIN"
                        type="number"
                        id="startYear"
                        name="startYear"
                        value={formData.startYear}
                        onChange={handleInputChange}
                        label="Start Year"
                        required
                    />
                </div>
                <div>
                    <TextField
                        cssStyle="ADMIN"
                        type="number"
                        id="endYear"
                        name="endYear"
                        value={formData.endYear}
                        onChange={handleInputChange}
                        label="End Year"
                        disabled={formData.isCurrent}
                    />
                </div>
                <div className="flex items-center">
                    <Checkbox
                        cssStyle="ADMIN"
                        id="isCurrent"
                        name="isCurrent"
                        checked={formData.isCurrent}
                        onChange={handleInputChange}
                        label="Currently here"
                    />
                </div>
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
                        Create Journey
                    </button>
                </div>
            </form>
        </Modal>
    );
} 