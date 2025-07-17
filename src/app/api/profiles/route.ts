import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository } from '@/lib/repositories/profileRepository';

const profileRepository = new ProfileRepository();

export async function GET(request: NextRequest) {
    try {
        const profile = await profileRepository.findFirst();

        if (!profile) {
            return NextResponse.json(
                { error: 'No profile found' },
                { status: 404 }
            );
        }

        return NextResponse.json(profile, { status: 200 });
    } catch (error) {
        console.error('Error fetching main profile:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 