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

export interface CreateProjectRequest {
    name: string;
    description?: string;
    imagePath?: string;
    githubUrl?: string;
    projectUrl?: string;
    createdBy?: number;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    imagePath?: string;
    githubUrl?: string;
    projectUrl?: string;
    technologyIds?: number[];
    updatedBy?: number;
}

export interface CreateJourneyRequest {
    title: string;
    institution: string;
    description: string;
    startYear: number;
    endYear?: number;
    isCurrent?: boolean;
    createdBy?: number;
}

export interface UpdateJourneyRequest {
    title?: string;
    institution?: string;
    description?: string;
    startYear?: number;
    endYear?: number;
    isCurrent?: boolean;
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

export interface ProjectResponse {
    id: number;
    name: string;
    description: string | null;
    imagePath: string | null;
    githubUrl: string | null;
    projectUrl: string | null;
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
    MappingProjectTechnology: {
        id: number;
        technology: TechnologyResponse;
    }[];
}

export interface JourneyResponse {
    id: number;
    title: string;
    institution: string;
    description: string;
    startYear: number;
    endYear: number | null;
    isCurrent: boolean;
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

export interface CreateEnquiryResponse {
    message: string;
    id: number;
}

export interface CreateProfileResponse {
    message: string;
    profile: ProfileResponse;
}

export interface CreateProjectResponse {
    message: string;
    project: ProjectResponse;
}

export interface CreateJourneyResponse {
    message: string;
    journey: JourneyResponse;
}

// Filter types
export interface ProjectFilters {
    includeDeleted?: boolean;
    createdBy?: number;
    name?: string;
}

export interface JourneyFilters {
    includeDeleted?: boolean;
    createdBy?: number;
    isCurrent?: boolean;
    startYear?: number;
    endYear?: number;
}

// API Error response
export interface ApiErrorResponse {
    error: string;
} 