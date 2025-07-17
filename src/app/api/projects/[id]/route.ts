import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository } from '@/lib/repositories/projectRepository';

const projectRepository = new ProjectRepository();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const projectId = parseInt(params.id);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        const project = await projectRepository.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 