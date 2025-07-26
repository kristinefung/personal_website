import { z } from 'zod';

// Contact Form Schema
export const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.email('Please enter a valid email address').optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Login Form Schema
export const loginFormSchema = z.object({
    email: z.email('Please enter a valid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Journey Form Schema (for form inputs where years come as strings)
export const journeyFormInputSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    institution: z.string().min(1, 'Institution is required').max(255, 'Institution must be less than 255 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
    startYear: z.string().min(1, 'Start year is required').refine((val) => {
        const year = parseInt(val, 10);
        return year >= 1900 && year <= new Date().getFullYear() + 10;
    }, 'Start year must be between 1900 and the near future'),
    endYear: z.string().optional().refine((val) => {
        if (!val) return true;
        const year = parseInt(val, 10);
        return year >= 1900 && year <= new Date().getFullYear() + 10;
    }, 'End year must be between 1900 and the near future'),
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

export type JourneyFormInputData = z.infer<typeof journeyFormInputSchema>;

// Journey Form Schema
export const journeyFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    institution: z.string().min(1, 'Institution is required').max(255, 'Institution must be less than 255 characters'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
    startYear: z.number().min(1900, 'Start year must be after 1900').max(new Date().getFullYear() + 10, 'Start year cannot be too far in the future'),
    endYear: z.number().min(1900, 'End year must be after 1900').max(new Date().getFullYear() + 10, 'End year cannot be too far in the future').optional(),
    isCurrent: z.boolean().default(false),
}).refine((data) => {
    if (!data.isCurrent && !data.endYear) {
        return false;
    }
    if (data.endYear && data.endYear < data.startYear) {
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
    name: z.string().min(1, 'Project name is required').max(255, 'Project name must be less than 255 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
    technologies: z.string().min(1, 'At least one technology is required'),
    githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    projectUrl: z.string().url('Please enter a valid project URL').optional().or(z.literal('')),
    imagePath: z.string().optional().or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

// Profile Form Schema
export const profileFormSchema = z.object({
    bio: z.string().min(1, 'Bio is required').max(1000, 'Bio must be less than 1000 characters'),
    profileImagePath: z.string().optional().or(z.literal('')),
    email: z.email('Please enter a valid email address').optional().or(z.literal('')),
    githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Enquiry API Schema (for backend validation)
export const createEnquirySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.email('Please enter a valid email address').optional(),
    phone: z.string().optional(),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
});

export type CreateEnquiryData = z.infer<typeof createEnquirySchema>; 