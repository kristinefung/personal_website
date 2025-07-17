import { NextRequest, NextResponse } from 'next/server';
import { JourneyRepository } from '@/lib/repositories/journeyRepository';

const journeyRepository = new JourneyRepository();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const createdBy = searchParams.get('createdBy');
        const isCurrent = searchParams.get('isCurrent');
        const startYear = searchParams.get('startYear');
        const endYear = searchParams.get('endYear');

        const journeys = await journeyRepository.findAll({
            deleted: includeDeleted ? undefined : false,
            createdBy: createdBy ? parseInt(createdBy) : undefined,
            isCurrent: isCurrent === 'true' ? true : isCurrent === 'false' ? false : undefined,
            startYear: startYear ? parseInt(startYear) : undefined,
            endYear: endYear ? parseInt(endYear) : undefined,
        });

        return NextResponse.json(journeys, { status: 200 });
    } catch (error) {
        console.error('Error fetching journeys:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 