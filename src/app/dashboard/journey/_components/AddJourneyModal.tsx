"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";

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
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add Journey</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form autoComplete="off" onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    {/* Institution */}
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

                    {/* Description */}
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

                    {/* Start Year */}
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

                    {/* End Year (disabled if isCurrent) */}
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

                    {/* Is Current */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            name="isCurrent"
                            checked={formData.isCurrent}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        <label htmlFor="isCurrent" className="text-sm text-gray-700">
                            Currently here
                        </label>
                    </div>

                    {/* Action Buttons */}
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
            </div>
        </div>
    );
} 