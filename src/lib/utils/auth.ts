import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserSessionRepository } from '@/lib/repositories/userSessionRepository';

interface JWTPayload {
    userId: number;
    iat: number;
    exp: number;
}

interface AuthResult {
    success: boolean;
    userId?: number;
    error?: string;
}

export async function verifyAuthToken(request: NextRequest): Promise<AuthResult> {
    try {
        // Extract Authorization header
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                success: false,
                error: 'Missing or invalid authorization header'
            };
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.substring(7);

        if (!token) {
            return {
                success: false,
                error: 'Missing authentication token'
            };
        }

        // Verify JWT token
        let decoded: JWTPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        } catch (jwtError) {
            return {
                success: false,
                error: 'Invalid or expired token'
            };
        }

        // Check if session exists and is valid in database
        const sessionRepository = new UserSessionRepository();
        const isValidSession = await sessionRepository.isValidSession(token);

        if (!isValidSession) {
            return {
                success: false,
                error: 'Session expired or invalid'
            };
        }

        return {
            success: true,
            userId: decoded.userId
        };

    } catch (error) {
        console.error('Auth verification error:', error);
        return {
            success: false,
            error: 'Authentication verification failed'
        };
    }
} 