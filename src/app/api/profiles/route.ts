import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository, CreateProfileData } from '@/lib/repositories/profileRepository';
import { verifyAuthToken } from '@/lib/utils/auth';
import { profileFormSchema, formatZodErrors } from '@/lib/validation/schemas';

const profileRepository = new ProfileRepository();

export async function GET() {
    try {
        const profile = await profileRepository.findFirst();
        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate and transform request body with shared Zod schema
        const validationResult = profileFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: `Validation failed: ${formatZodErrors(validationResult.error)}` },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;

        const profileData: CreateProfileData = {
            bio: validatedData.bio,
            profileImagePath: validatedData.profileImagePath,
            email: validatedData.email,
            githubUrl: validatedData.githubUrl,
            linkedinUrl: validatedData.linkedinUrl,
            createdBy: body.createdBy || undefined,
        };

        const profile = await profileRepository.create(profileData);

        return NextResponse.json(
            {
                message: 'Profile created successfully',
                profile
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 