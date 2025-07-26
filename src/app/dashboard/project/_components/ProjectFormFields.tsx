import React from "react";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";

interface FormData {
    name: string;
    description: string;
    technologies: string;
    githubUrl: string;
    projectUrl: string;
    imagePath: string;
}

interface FormErrors {
    name?: string;
    description?: string;
    technologies?: string;
    githubUrl?: string;
    projectUrl?: string;
    imagePath?: string;
}

interface ProjectFormFieldsProps {
    formData: FormData;
    errors: FormErrors;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    previewImageUrl: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedImageFile?: File | null;
    projectImagePath?: string;
    isSubmitting: boolean;
}

const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({
    formData,
    errors,
    handleInputChange,
    previewImageUrl,
    handleFileChange,
    selectedImageFile,
    projectImagePath,
    isSubmitting,
}) => (
    <>
        {/* Project Image */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
            />
            {previewImageUrl ? (
                <img src={previewImageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border" />
            ) : projectImagePath ? (
                <img src={`/api/images/${projectImagePath}`} alt="Current" className="mt-2 w-full h-40 object-cover rounded-lg border" />
            ) : null}
        </div>
        {/* Project Title */}
        <div>
            <TextField
                cssStyle="ADMIN"
                type="text"
                id="name"
                name="name"
                label="Project Title"
                required
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.name}
            />
        </div>
        {/* Description */}
        <div>
            <TextArea
                cssStyle="ADMIN"
                id="description"
                name="description"
                label="Description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.description}
            />
        </div>
        {/* Technologies */}
        <div>
            <TextField
                cssStyle="ADMIN"
                type="text"
                id="technologies"
                name="technologies"
                label="Technologies"
                required
                placeholder="React, Node.js, MongoDB"
                value={formData.technologies}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.technologies}
            />
        </div>
        {/* GitHub URL */}
        <div>
            <TextField
                cssStyle="ADMIN"
                type="url"
                id="githubUrl"
                name="githubUrl"
                label="GitHub URL"
                placeholder="https://github.com/username/project"
                value={formData.githubUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.githubUrl}
            />
        </div>
        {/* Live Demo URL */}
        <div>
            <TextField
                cssStyle="ADMIN"
                type="url"
                id="projectUrl"
                name="projectUrl"
                label="Live Demo URL"
                placeholder="https://project-demo.com"
                value={formData.projectUrl}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.projectUrl}
            />
        </div>
    </>
);

export default ProjectFormFields; 