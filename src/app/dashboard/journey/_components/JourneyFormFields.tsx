import React from "react";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";
import Checkbox from "@/component/form/Checkbox";

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

interface JourneyFormFieldsProps {
    formData: FormData;
    errors: FormErrors;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    isSubmitting: boolean;
}

const JourneyFormFields: React.FC<JourneyFormFieldsProps> = ({
    formData,
    errors,
    handleInputChange,
    isSubmitting
}) => (
    <>
        <div>
            <TextField
                cssStyle="ADMIN"
                type="text"
                id="title"
                name="title"
                label="Title"
                required
                value={formData.title}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.title}
            />
        </div>
        <div>
            <TextField
                cssStyle="ADMIN"
                type="text"
                id="institution"
                name="institution"
                label="Institution"
                required
                value={formData.institution}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.institution}
            />
        </div>
        <div>
            <TextArea
                cssStyle="ADMIN"
                id="description"
                name="description"
                label="Description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.description}
            />
        </div>
        <div>
            <TextField
                cssStyle="ADMIN"
                type="number"
                id="startYear"
                name="startYear"
                label="Start Year"
                required
                value={formData.startYear}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.startYear}
            />
        </div>
        <div>
            <TextField
                cssStyle="ADMIN"
                type="number"
                id="endYear"
                name="endYear"
                label="End Year"
                value={formData.endYear}
                onChange={handleInputChange}
                disabled={formData.isCurrent || isSubmitting}
                error={errors.endYear}
            />
        </div>
        <div className="flex items-center">
            <Checkbox
                cssStyle="ADMIN"
                id="isCurrent"
                name="isCurrent"
                label="Currently here"
                checked={formData.isCurrent}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={errors.isCurrent}
            />
        </div>
    </>
);

export default JourneyFormFields; 