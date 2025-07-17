import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository, CreateProfileData } from '@/lib/repositories/profileRepository';

const profileRepository = new ProfileRepository();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const getFirst = searchParams.get('first') === 'true';
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const createdBy = searchParams.get('createdBy');

        if (getFirst) {
            // Get the first/main profile
            const profile = await profileRepository.findFirst();

            if (!profile) {
                return NextResponse.json(
                    { error: 'No profile found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(profile, { status: 200 });
        } else {
            // Get all profiles
            const profiles = await profileRepository.findAll({
                deleted: includeDeleted ? undefined : false,
                createdBy: createdBy ? parseInt(createdBy) : undefined,
            });

            return NextResponse.json(profiles, { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const { bio } = body;

        if (!bio || bio.trim().length === 0) {
            return NextResponse.json(
                { error: 'Bio is required' },
                { status: 400 }
            );
        }

        // Validate bio length (max 1000 characters as per schema)
        if (bio.trim().length > 1000) {
            return NextResponse.json(
                { error: 'Bio cannot exceed 1000 characters' },
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

        // Validate URLs if provided
        if (body.githubUrl && !isValidUrl(body.githubUrl)) {
            return NextResponse.json(
                { error: 'Please provide a valid GitHub URL' },
                { status: 400 }
            );
        }

        if (body.linkedinUrl && !isValidUrl(body.linkedinUrl)) {
            return NextResponse.json(
                { error: 'Please provide a valid LinkedIn URL' },
                { status: 400 }
            );
        }

        const profileData: CreateProfileData = {
            bio: bio.trim(),
            profileImagePath: body.profileImagePath?.trim() || undefined,
            email: body.email?.trim() || undefined,
            githubUrl: body.githubUrl?.trim() || undefined,
            linkedinUrl: body.linkedinUrl?.trim() || undefined,
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

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
} 