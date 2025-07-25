import React from "react";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";
import Checkbox from "@/component/form/Checkbox";

interface JourneyFormFieldsProps {
    formData: {
        title: string;
        institution: string;
        description: string;
        startYear: string;
        endYear: string;
        isCurrent: boolean;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const JourneyFormFields: React.FC<JourneyFormFieldsProps> = ({ formData, handleInputChange }) => (
    <>
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
    </>
);

export default JourneyFormFields; 