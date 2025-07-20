export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    sessionToken?: string;
}

export interface AuthApiErrorResponse {
    success: false;
    message: string;
    errors?: string[];
} 