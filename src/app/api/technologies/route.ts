import { NextRequest, NextResponse } from 'next/server';
import { TechnologyRepository, CreateTechnologyData } from '@/lib/repositories/technologyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

const technologyRepository = new TechnologyRepository();

export async function GET() {
    try {
        const technologies = await technologyRepository.findAll();
        return NextResponse.json(technologies, { status: 200 });
    } catch (error) {
        console.error('Error fetching technologies:', error);
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

        // Parse request body
        const body = await request.json();
        const { name, color } = body;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Technology name is required' },
                { status: 400 }
            );
        }

        if (!color || color.trim().length === 0) {
            return NextResponse.json(
                { error: 'Technology color is required' },
                { status: 400 }
            );
        }

        // Check if technology with same name already exists
        const existingTechnology = await technologyRepository.findByName(name.trim());
        if (existingTechnology) {
            return NextResponse.json(
                { error: 'A technology with this name already exists' },
                { status: 409 }
            );
        }

        // Create technology
        const createData: CreateTechnologyData = {
            name: name.trim(),
            color: color.trim(),
        };

        const newTechnology = await technologyRepository.create(createData);

        return NextResponse.json({
            message: 'Technology created successfully',
            technology: newTechnology
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating technology:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 