import React, { useState, useEffect } from "react";
import Modal from "@/component/Modal";
import ProjectFormFields from "./ProjectFormFields";
import { ProjectResponse } from "@/types/api";
import { projectFormSchema } from "@/lib/validation/schemas";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (projectData: any) => void;
    initialData?: {
        name: string;
        description: string;
        technologies: string;
        githubUrl: string;
        projectUrl: string;
        imagePath: string;
    };
    mode: "ADD" | "EDIT";
    project?: ProjectResponse | null;
}

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

const emptyForm: FormData = {
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    projectUrl: "",
    imagePath: "",
};

const ProjectFormModal: React.FC<ProjectModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    mode,
    project,
}) => {
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (mode === "EDIT" && project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                technologies: project.MappingProjectTechnology?.map(m => m.technology.name).join(", ") || "",
                githubUrl: project.githubUrl || "",
                projectUrl: project.projectUrl || "",
                imagePath: project.imagePath || "",
            });
            setSelectedImageFile(null);
            setPreviewImageUrl(null);
        } else if (mode === "ADD" && initialData) {
            setFormData(initialData);
            setSelectedImageFile(null);
            setPreviewImageUrl(null);
        } else if (mode === "ADD") {
            setFormData(emptyForm);
            setSelectedImageFile(null);
            setPreviewImageUrl(null);
        }
        setErrors({});
    }, [isOpen, mode, project, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const validationResult = projectFormSchema.safeParse(formData);

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
            let updatedFormData = { ...formData };

            if (selectedImageFile) {
                try {
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
                    updatedFormData.imagePath = uploadData.path;
                } catch (error) {
                    console.error('Image upload failed:', error);
                    // Continue with form submission even if image upload fails
                }
            }

            onSave({ ...updatedFormData });
            onClose();
        } catch (error) {
            console.error('Error saving project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === "ADD" ? "Add New Project" : "Edit Project"}>
            <form autoComplete="off" onSubmit={handleSubmit} noValidate className="space-y-4">
                <ProjectFormFields
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    previewImageUrl={previewImageUrl}
                    handleFileChange={handleFileChange}
                    selectedImageFile={selectedImageFile}
                    projectImagePath={mode === "EDIT" ? project?.imagePath || undefined : undefined}
                    isSubmitting={isSubmitting}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : (mode === "ADD" ? "Create Project" : "Save Project")}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectFormModal; 