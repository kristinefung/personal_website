// Request types
export interface CreateEnquiryRequest {
    name: string;
    email?: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface UpdateEnquiryRequest {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

export interface CreateProfileRequest {
    bio: string;
    profileImagePath?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    createdBy?: number;
}

export interface UpdateProfileRequest {
    bio?: string;
    profileImagePath?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    technologyIds?: number[];
    updatedBy?: number;
}

// Response types
export interface EnquiryResponse {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    subject: string;
    message: string;
    createdAt: Date;
    updatedAt: Date | null;
    deleted: boolean;
    createdByUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
    updatedByUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export interface TechnologyResponse {
    id: number;
    name: string;
    color: string;
}

export interface ProfileResponse {
    id: number;
    bio: string;
    profileImagePath: string | null;
    email: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deleted: boolean;
    createdByUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
    updatedByUser?: {
        id: number;
        name: string;
        email: string;
    } | null;
    MappingProfileTechnology: {
        id: number;
        technology: TechnologyResponse;
    }[];
}

export interface CreateEnquiryResponse {
    message: string;
    id: number;
}

export interface CreateProfileResponse {
    message: string;
    profile: ProfileResponse;
}

// API Error response
export interface ApiErrorResponse {
    error: string;
} 