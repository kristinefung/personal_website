"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (projectData: any) => void;
}

export default function AddProjectModal({ isOpen, onClose, onSave }: AddProjectModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        technologies: "",
        githubUrl: "",
        projectUrl: "",
        imagePath: "",
    });
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedImageFile) {
            const formDataUpload = new FormData();
            formDataUpload.append('file', selectedImageFile);

            const uploadRes = await fetch('/api/images/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Failed to upload image');
            }

            formData.imagePath = uploadData.path;
            console.log(formData.imagePath);
        }
        onSave({ ...formData });
        setFormData({
            name: "",
            description: "",
            technologies: "",
            githubUrl: "",
            projectUrl: "",
            imagePath: "",
        });
        setSelectedImageFile(null);
        setPreviewImageUrl(null);
        onClose();
    };

    const handleCancel = () => {
        // Reset form on cancel
        setFormData({
            name: "",
            description: "",
            technologies: "",
            githubUrl: "",
            projectUrl: "",
            imagePath: "",
        });
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
                    <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form autoComplete="off" onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Project Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {previewImageUrl ? (
                            <img src={previewImageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border" />
                        ) : formData.imagePath ? (
                            <img src={`/api/images/${formData.imagePath}`} alt="Current" className="mt-2 w-full h-40 object-cover rounded-lg border" />
                        ) : null}
                    </div>

                    {/* Project Title */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                            placeholder="Enter project name"
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
                            placeholder="Enter project description"
                        />
                    </div>

                    {/* Technologies */}
                    <div>
                        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                            Technologies (comma separated)
                        </label>
                        <input
                            type="text"
                            id="technologies"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleInputChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            id="githubUrl"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username/project"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Live Demo URL */}
                    <div>
                        <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                            Live Demo URL
                        </label>
                        <input
                            type="url"
                            id="projectUrl"
                            name="projectUrl"
                            value={formData.projectUrl}
                            onChange={handleInputChange}
                            placeholder="https://project-demo.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 