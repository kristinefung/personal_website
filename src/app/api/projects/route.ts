import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository } from '@/lib/repositories/projectRepository';

const projectRepository = new ProjectRepository();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const createdBy = searchParams.get('createdBy');
        const name = searchParams.get('name');

        const projects = await projectRepository.findAll({
            deleted: includeDeleted ? undefined : false,
            createdBy: createdBy ? parseInt(createdBy) : undefined,
            name: name || undefined,
        });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 