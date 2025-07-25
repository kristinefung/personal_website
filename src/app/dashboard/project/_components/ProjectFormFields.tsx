import React from "react";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";

interface ProjectFormFieldsProps {
    formData: {
        name: string;
        description: string;
        technologies: string;
        githubUrl: string;
        projectUrl: string;
        imagePath: string;
    };
    previewImageUrl: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedImageFile?: File | null;
    projectImagePath?: string;
}

const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({
    formData,
    previewImageUrl,
    handleInputChange,
    handleFileChange,
    selectedImageFile,
    projectImagePath,
}) => (
    <>
        {/* Project Image */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewImageUrl ? (
                <img src={previewImageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg border" />
            ) : formData.imagePath ? (
                <img src={`/api/images/${formData.imagePath}`} alt="Current" className="mt-2 w-full h-40 object-cover rounded-lg border" />
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
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
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
                required
                placeholder="Enter project description"
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
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
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
                required
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/project"
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
                required
                value={formData.projectUrl}
                onChange={handleInputChange}
                placeholder="https://project-demo.com"
            />
        </div>
    </>
);

export default ProjectFormFields; 