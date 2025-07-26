import { NextRequest, NextResponse } from 'next/server';
import { EnquiryRepository, CreateEnquiryData } from '@/lib/repositories/enquiryRepository';
import { verifyAuthToken } from '@/lib/utils/auth';
import { contactFormSchema, formatZodErrors } from '@/lib/validation/schemas';

const enquiryRepository = new EnquiryRepository();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate and transform request body with shared Zod schema
        const validationResult = contactFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: `Validation failed: ${formatZodErrors(validationResult.error)}` },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;

        const enquiryData: CreateEnquiryData = {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            subject: validatedData.subject,
            message: validatedData.message,
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