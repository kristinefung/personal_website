import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository } from '@/lib/repositories/profileRepository';

const profileRepository = new ProfileRepository();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const parsedId = parseInt(id);
        if (!parsedId) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }
        const body = await request.json();

        // Validate fields (reuse logic from POST)
        if (body.bio && body.bio.trim().length > 1000) {
            return NextResponse.json(
                { error: 'Bio cannot exceed 1000 characters' },
                { status: 400 }
            );
        }
        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }
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

        // Update profile
        const updatedProfile = await profileRepository.update(
            parsedId,
            {
                bio: body.bio,
                profileImagePath: body.profileImagePath,
                email: body.email,
                githubUrl: body.githubUrl,
                linkedinUrl: body.linkedinUrl,
            },
            body.updatedBy
        );

        return NextResponse.json(updatedProfile, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
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