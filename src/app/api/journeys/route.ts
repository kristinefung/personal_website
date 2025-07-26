import { NextRequest, NextResponse } from 'next/server';
import { JourneyRepository } from '@/lib/repositories/journeyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';
import { journeyFormSchema, formatZodErrors } from '@/lib/validation/schemas';

const journeyRepository = new JourneyRepository();

export async function GET() {
    try {
        const journeys = await journeyRepository.findAll();
        return NextResponse.json(journeys);
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

        // Validate form data using the same schema as frontend
        const validationResult = journeyFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: `Validation failed: ${formatZodErrors(validationResult.error)}` },
                { status: 400 }
            );
        }

        // Prepare create data
        const createData = {
            title: validationResult.data.title,
            institution: validationResult.data.institution,
            description: validationResult.data.description,
            startYear: parseInt(validationResult.data.startYear, 10),
            endYear: validationResult.data.endYear ? parseInt(validationResult.data.endYear, 10) : undefined,
            isCurrent: validationResult.data.isCurrent,
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