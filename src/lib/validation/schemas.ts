import { z } from 'zod';

// Base validation schemas that can be reused for both form and API
const baseNameSchema = z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters');
const baseEmailSchema = z.email('Please enter a valid email address');
const baseSubjectSchema = z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters');
const baseMessageSchema = z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters');
const baseBioSchema = z.string().min(1, 'Bio is required').max(1000, 'Bio must be less than 1000 characters');
const baseTitleSchema = z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters');
const baseInstitutionSchema = z.string().min(1, 'Institution is required').max(255, 'Institution must be less than 255 characters');
const baseDescriptionSchema = z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters');
const baseTechnologiesSchema = z.string().min(1, 'At least one technology is required');
const baseUrlSchema = z.url('Please enter a valid URL');

// Year validation (can be reused for both string and number)
const yearValidation = (val: string | number) => {
    const year = typeof val === 'string' ? parseInt(val, 10) : val;
    return year >= 1900 && year <= new Date().getFullYear() + 10;
};

// Contact Form Schema
export const contactFormSchema = z.object({
    name: baseNameSchema,
    email: baseEmailSchema.optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    subject: baseSubjectSchema,
    message: baseMessageSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Login Form Schema
export const loginFormSchema = z.object({
    email: baseEmailSchema.min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Journey Form Schema
export const journeyFormSchema = z.object({
    title: baseTitleSchema,
    institution: baseInstitutionSchema,
    description: baseDescriptionSchema,
    startYear: z.string().min(1, 'Start year is required').refine(yearValidation, 'Start year must be between 1900 and the near future'),
    endYear: z.string().optional().refine((val) => !val || yearValidation(val), 'End year must be between 1900 and the near future'),
    isCurrent: z.boolean(),
}).refine((data) => {
    if (!data.isCurrent && !data.endYear) {
        return false;
    }
    if (data.endYear && parseInt(data.endYear, 10) < parseInt(data.startYear, 10)) {
        return false;
    }
    return true;
}, {
    message: 'End year must be after start year, or mark as current',
    path: ['endYear'],
});

export type JourneyFormData = z.infer<typeof journeyFormSchema>;

// Project Form Schema
export const projectFormSchema = z.object({
    name: baseTitleSchema,
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
    technologies: baseTechnologiesSchema,
    githubUrl: baseUrlSchema.optional().or(z.literal('')),
    projectUrl: baseUrlSchema.optional().or(z.literal('')),
    imagePath: z.string().optional().or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

// Profile Form Schema
export const profileFormSchema = z.object({
    bio: baseBioSchema,
    profileImagePath: z.string().optional().or(z.literal('')),
    email: baseEmailSchema.optional().or(z.literal('')),
    githubUrl: baseUrlSchema.optional().or(z.literal('')),
    linkedinUrl: baseUrlSchema.optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Helper function to format validation errors consistently
export const formatZodErrors = (error: z.ZodError) => {
    return error.issues.map((issue) =>
        `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');
}; 