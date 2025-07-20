import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Simple health check - you can add database connectivity check here if needed
        return NextResponse.json(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'personal-website'
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 