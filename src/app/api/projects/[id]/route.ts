import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository, UpdateProjectData } from '@/lib/repositories/projectRepository';
import { TechnologyRepository } from '@/lib/repositories/technologyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

const projectRepository = new ProjectRepository();
const technologyRepository = new TechnologyRepository();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = parseInt(id);

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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        // Check if project exists
        const existingProject = await projectRepository.findById(projectId);
        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { name, description, githubUrl, projectUrl, technologies } = body;

        // Validate input
        if (name !== undefined && (!name || name.trim().length === 0)) {
            return NextResponse.json(
                { error: 'Project name cannot be empty' },
                { status: 400 }
            );
        }

        if (name && name.trim().length > 255) {
            return NextResponse.json(
                { error: 'Project name cannot exceed 255 characters' },
                { status: 400 }
            );
        }

        if (description && description.trim().length > 1000) {
            return NextResponse.json(
                { error: 'Description cannot exceed 1000 characters' },
                { status: 400 }
            );
        }

        // Validate URLs if provided
        if (githubUrl && !isValidUrl(githubUrl)) {
            return NextResponse.json(
                { error: 'Please provide a valid GitHub URL' },
                { status: 400 }
            );
        }

        if (projectUrl && !isValidUrl(projectUrl)) {
            return NextResponse.json(
                { error: 'Please provide a valid project URL' },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: UpdateProjectData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (description !== undefined) {
            updateData.description = description.trim() || null;
        }

        if (githubUrl !== undefined) {
            updateData.githubUrl = githubUrl.trim() || null;
        }

        if (projectUrl !== undefined) {
            updateData.projectUrl = projectUrl.trim() || null;
        }

        // Update project
        await projectRepository.update(
            projectId,
            updateData,
            authResult.userId
        );

        // Handle technologies if provided
        if (technologies !== undefined) {
            if (technologies && technologies.trim()) {
                const technologyNames = technologies.split(',')
                    .map((tech: string) => tech.trim())
                    .filter((tech: string) => tech.length > 0);

                const technologyIds = await findOrCreateTechnologies(technologyNames);
                await projectRepository.updateTechnologies(projectId, technologyIds);
            } else {
                // Clear all technologies if empty string provided
                await projectRepository.updateTechnologies(projectId, []);
            }
        }

        // Fetch the updated project with technologies
        const updatedProject = await projectRepository.findById(projectId);

        return NextResponse.json({
            message: 'Project updated successfully',
            project: updatedProject
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify authentication
        const authResult = await verifyAuthToken(request);
        if (!authResult.success) {
            return NextResponse.json(
                { error: authResult.error || 'Authentication failed' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        // Check if project exists
        const existingProject = await projectRepository.findById(projectId);
        if (!existingProject) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        // Soft delete the project
        await projectRepository.delete(projectId, authResult.userId);

        return NextResponse.json({
            message: 'Project deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

// Helper function to find or create technologies
async function findOrCreateTechnologies(technologyNames: string[]): Promise<number[]> {
    const technologyIds: number[] = [];

    for (const name of technologyNames) {
        // Try to find existing technology
        let technology = await technologyRepository.findByName(name);

        // Create if doesn't exist
        if (!technology) {
            technology = await technologyRepository.create({
                name,
                color: '#FFFFFF'
            });
        }

        technologyIds.push(technology.id);
    }

    return technologyIds;
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