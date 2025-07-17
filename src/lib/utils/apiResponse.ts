export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

export function createErrorResponse(error: string, statusCode?: number): ApiResponse {
    return {
        success: false,
        error,
    };
}

export function handleApiError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
} 