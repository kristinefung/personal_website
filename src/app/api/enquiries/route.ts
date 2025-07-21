import { NextRequest, NextResponse } from 'next/server';
import { EnquiryRepository, CreateEnquiryData } from '@/lib/repositories/enquiryRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

const enquiryRepository = new EnquiryRepository();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { name, subject, message } = body;

        if (!name || !subject || !message) {
            return NextResponse.json(
                { error: 'Name, subject, and message are required fields' },
                { status: 400 }
            );
        }

        // Validate email format if provided
        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        const enquiryData: CreateEnquiryData = {
            name: name.trim(),
            email: body.email?.trim() || undefined,
            phone: body.phone?.trim() || undefined,
            subject: subject.trim(),
            message: message.trim(),
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