import { NextRequest, NextResponse } from 'next/server';
import { JourneyRepository } from '@/lib/repositories/journeyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

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

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }
        const body = await request.json();
        const { title, institution, description, startYear, endYear, isCurrent } = body;

        // Validate required fields
        if (!title || !institution || !startYear) {
            return NextResponse.json(
                { error: 'Title, institution, and startYear are required' },
                { status: 400 }
            );
        }

        // Prepare create data
        const createData = {
            title: title.trim(),
            institution: institution.trim(),
            description: description?.trim() || '',
            startYear: parseInt(startYear, 10),
            endYear: isCurrent ? undefined : (endYear ? parseInt(endYear, 10) : undefined),
            isCurrent: !!isCurrent,
            createdBy: authResult.userId,
        };

        const newJourney = await journeyRepository.create(createData);
        return NextResponse.json(newJourney, { status: 201 });
    } catch (error) {
        console.error('Error creating journey:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 