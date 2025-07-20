import {
    LoginRequest,
    LoginResponse,
} from '@/types/auth';

// JWT token payload interface
interface JWTPayload {
    userId: number;
    iat: number;
    exp: number;
}

// Session validation response interface
interface SessionValidationResponse {
    valid: boolean;
    message: string;
}

const API_BASE_URL = '/api/auth';

class AuthApiService {
    private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Decode JWT token to extract payload
     */
    private decodeJWTPayload(token: string): JWTPayload | null {
        try {
            // JWT has 3 parts: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            // Decode the payload (second part)
            const payload = parts[1];
            // Add padding if needed for base64 decoding
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload);

            return JSON.parse(decodedPayload) as JWTPayload;
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            return null;
        }
    }

    /**
     * Get expiry time from JWT token
     */
    private getTokenExpiryTime(token: string): Date | null {
        const payload = this.decodeJWTPayload(token);
        if (!payload || !payload.exp) {
            return null;
        }

        // JWT exp is in seconds, convert to milliseconds
        return new Date(payload.exp * 1000);
    }

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.makeRequest<LoginResponse>(`${API_BASE_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Store session token in localStorage if login successful
        if (response.success && response.sessionToken) {
            localStorage.setItem('sessionToken', response.sessionToken);

            // Extract expiry time from JWT token
            const expiryTime = this.getTokenExpiryTime(response.sessionToken);
            if (expiryTime) {
                localStorage.setItem('sessionExpiry', expiryTime.toISOString());
            }
        }

        return response;
    }

    async logout(): Promise<void> {
        this.clearSession();
    }

    async validateLocalSession(): Promise<SessionValidationResponse> {
        const sessionToken = localStorage.getItem('sessionToken');

        if (!sessionToken) {
            return {
                valid: false,
                message: 'No session token found',
            };
        }

        // Check if JWT token is expired by decoding it
        if (this.isTokenExpired(sessionToken)) {
            this.clearSession();
            return {
                valid: false,
                message: 'Session expired',
            };
        }

        return {
            valid: true,
            message: 'Session is valid',
        };
    }

    getCurrentSessionToken(): string | null {
        return localStorage.getItem('sessionToken');
    }

    private clearSession(): void {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionExpiry');
    }

    /**
     * Check if a JWT token is expired
     */
    private isTokenExpired(token: string): boolean {
        const expiryTime = this.getTokenExpiryTime(token);
        if (!expiryTime) {
            return true; // If we can't decode the token, consider it expired
        }
        return expiryTime <= new Date();
    }

    // Helper method for authenticated requests to other APIs
    async makeAuthenticatedRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
        const sessionToken = this.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        // Check if token is expired before making the request
        if (this.isTokenExpired(sessionToken)) {
            this.clearSession();
            throw new Error('Session expired');
        }

        return this.makeRequest<T>(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                ...options.headers,
            },
        });
    }
}

export const authApiService = new AuthApiService(); 