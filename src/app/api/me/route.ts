import { NextRequest, NextResponse } from 'next/server';
import { UserSessionRepository } from '../../../lib/repositories/userSessionRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success || !authResult.userId) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        // Get session token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;
        if (!token) {
            return NextResponse.json(
                { error: 'Missing authentication token' },
                { status: 401 }
            );
        }

        // Get user info from session
        const sessionRepository = new UserSessionRepository();
        const session = await sessionRepository.findByTokenWithUser(token);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'User not found or session invalid' },
                { status: 404 }
            );
        }

        // Return user info (customize as needed)
        return NextResponse.json({
            id: session.user.id,
            name: session.user.name,
            email: session.user.email
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 