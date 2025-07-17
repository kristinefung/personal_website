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

export interface CreateEnquiryResponse {
    message: string;
    id: number;
}

// API Error response
export interface ApiErrorResponse {
    error: string;
} 