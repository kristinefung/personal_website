"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { JourneyResponse } from "@/types/api";

interface EditJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    journey: JourneyResponse | null;
    onSave: (journeyData: any) => void;
}

export default function EditJourneyModal({ isOpen, onClose, journey, onSave }: EditJourneyModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        institution: "",
        description: "",
        startYear: "",
        endYear: "",
        isCurrent: false,
    });

    useEffect(() => {
        if (journey) {
            setFormData({
                title: journey.title || "",
                institution: journey.institution || "",
                description: journey.description || "",
                startYear: journey.startYear ? journey.startYear.toString() : "",
                endYear: journey.endYear ? journey.endYear.toString() : "",
                isCurrent: journey.isCurrent || false,
            });
        }
    }, [journey]);

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
        // Convert years to numbers/null
        const data = {
            ...formData,
            startYear: formData.startYear ? parseInt(formData.startYear, 10) : null,
            endYear: formData.isCurrent ? null : (formData.endYear ? parseInt(formData.endYear, 10) : null),
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
                    <h2 className="text-xl font-semibold text-gray-900">Edit Journey</h2>
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Institution */}
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                        </label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            value={formData.institution}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        />
                    </div>

                    {/* Start Year */}
                    <div>
                        <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Year
                        </label>
                        <input
                            type="number"
                            id="startYear"
                            name="startYear"
                            value={formData.startYear}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* End Year (disabled if isCurrent) */}
                    <div>
                        <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 mb-1">
                            End Year
                        </label>
                        <input
                            type="number"
                            id="endYear"
                            name="endYear"
                            value={formData.endYear}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                            Save Journey
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 