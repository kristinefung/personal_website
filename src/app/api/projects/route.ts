import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository, CreateProjectData } from '@/lib/repositories/projectRepository';
import { TechnologyRepository } from '@/lib/repositories/technologyRepository';
import { verifyAuthToken } from '@/lib/utils/auth';

const projectRepository = new ProjectRepository();
const technologyRepository = new TechnologyRepository();

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
        const { name, description, githubUrl, projectUrl, technologies, imagePath } = body;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        if (name.trim().length > 255) {
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

        // Check if project with same name already exists
        const existingProject = await projectRepository.findByName(name.trim());
        if (existingProject) {
            return NextResponse.json(
                { error: 'A project with this name already exists' },
                { status: 409 }
            );
        }

        // Prepare create data
        const createData: CreateProjectData = {
            name: name.trim(),
            description: description?.trim() || undefined,
            githubUrl: githubUrl?.trim() || undefined,
            projectUrl: projectUrl?.trim() || undefined,
            imagePath: imagePath?.trim() || undefined,
            createdBy: authResult.userId,
        };

        // Create project
        const newProject = await projectRepository.create(createData);

        // Handle technologies if provided
        if (technologies && technologies.trim()) {
            const technologyNames = technologies.split(',')
                .map((tech: string) => tech.trim())
                .filter((tech: string) => tech.length > 0);

            const technologyIds = await findOrCreateTechnologies(technologyNames);

            if (technologyIds.length > 0) {
                await projectRepository.updateTechnologies(newProject.id, technologyIds);
            }
        }

        // Fetch the complete project with technologies
        const projectWithTechnologies = await projectRepository.findById(newProject.id);

        return NextResponse.json({
            message: 'Project created successfully',
            project: projectWithTechnologies
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating project:', error);
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
                color: '#000000'
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