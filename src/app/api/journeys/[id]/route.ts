import { NextRequest, NextResponse } from 'next/server';
import { JourneyRepository } from '@/lib/repositories/journeyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

const journeyRepository = new JourneyRepository();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const journeyId = parseInt(id);

        if (isNaN(journeyId)) {
            return NextResponse.json(
                { error: 'Invalid journey ID' },
                { status: 400 }
            );
        }

        const journey = await journeyRepository.findById(journeyId);

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(journey, { status: 200 });
    } catch (error) {
        console.error('Error fetching journey:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const journeyId = parseInt(id);
        if (isNaN(journeyId)) {
            return NextResponse.json(
                { error: 'Invalid journey ID' },
                { status: 400 }
            );
        }
        const body = await request.json();
        const updatedJourney = await journeyRepository.update(journeyId, body);
        if (!updatedJourney) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedJourney, { status: 200 });
    } catch (error) {
        console.error('Error updating journey:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 