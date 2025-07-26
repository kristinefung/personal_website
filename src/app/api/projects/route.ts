import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository, CreateProjectData } from '@/lib/repositories/projectRepository';
import { verifyAuthToken } from '@/lib/utils/auth';
import { projectFormSchema, formatZodErrors } from '@/lib/validation/schemas';

const projectRepository = new ProjectRepository();

export async function GET() {
    try {
        const projects = await projectRepository.findAll();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
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

        // Validate and transform request body with shared Zod schema
        const validationResult = projectFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: `Validation failed: ${formatZodErrors(validationResult.error)}` },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;

        // Check if project with same name already exists
        const existingProject = await projectRepository.findByName(validatedData.name);
        if (existingProject) {
            return NextResponse.json(
                { error: 'A project with this name already exists' },
                { status: 409 }
            );
        }

        // Create project data
        const projectData: CreateProjectData = {
            name: validatedData.name,
            description: validatedData.description,
            githubUrl: validatedData.githubUrl,
            projectUrl: validatedData.projectUrl,
            imagePath: validatedData.imagePath,
            createdBy: authResult.userId,
        };

        const project = await projectRepository.create(projectData);

        // Handle technologies separately if provided
        if (validatedData.technologies) {
            const technologyNames = validatedData.technologies.split(',')
                .map(t => t.trim())
                .filter(Boolean);

            // Note: This would require implementing technology handling in the repository
            // For now, the project is created without technologies
        }

        return NextResponse.json(
            {
                message: 'Project created successfully',
                project
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
} 