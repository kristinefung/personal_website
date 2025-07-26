import { NextRequest, NextResponse } from 'next/server';
import { EnquiryRepository, CreateEnquiryData } from '@/lib/repositories/enquiryRepository';
import { verifyAuthToken } from '@/lib/utils/auth';
import { createEnquirySchema } from '@/lib/validation/schemas';

const enquiryRepository = new EnquiryRepository();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body with Zod
        const validationResult = createEnquirySchema.safeParse(body);

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map((err: any) =>
                `${err.path.join('.')}: ${err.message}`
            ).join(', ');

            return NextResponse.json(
                { error: `Validation failed: ${errorMessages}` },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;

        const enquiryData: CreateEnquiryData = {
            name: validatedData.name.trim(),
            email: validatedData.email?.trim() || undefined,
            phone: validatedData.phone?.trim() || undefined,
            subject: validatedData.subject.trim(),
            message: validatedData.message.trim(),
        };

        const enquiry = await enquiryRepository.create(enquiryData);

        return NextResponse.json(
            {
                message: 'Enquiry submitted successfully',
                id: enquiry.id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating enquiry:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get('includeDeleted') === 'true';

        const enquiries = await enquiryRepository.findAll({
            deleted: includeDeleted ? undefined : false,
        });

        return NextResponse.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 