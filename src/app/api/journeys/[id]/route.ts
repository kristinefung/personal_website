import { NextRequest, NextResponse } from 'next/server';
import { JourneyRepository } from '@/lib/repositories/journeyRepository';

const journeyRepository = new JourneyRepository();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const journeyId = parseInt(params.id);

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