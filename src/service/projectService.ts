import { ProjectResponse, ProjectFilters } from '@/types/api';
import { authApiService } from '@/service/authApiService';

interface UpdateProjectRequest {
    name?: string;
    description?: string;
    githubUrl?: string;
    projectUrl?: string;
    technologies?: string;
}

interface CreateProjectRequest {
    name: string;
    description?: string;
    githubUrl?: string;
    projectUrl?: string;
    technologies?: string;
}

class ProjectApiService {
    private baseUrl = '/api/projects';

    async getAllProjects(filters?: {
        includeDeleted?: boolean;
        createdBy?: number;
        name?: string;
    }): Promise<ProjectResponse[]> {
        const url = new URL(this.baseUrl, window.location.origin);

        if (filters?.includeDeleted) {
            url.searchParams.set('includeDeleted', 'true');
        }

        if (filters?.createdBy) {
            url.searchParams.set('createdBy', filters.createdBy.toString());
        }

        if (filters?.name) {
            url.searchParams.set('name', filters.name);
        }

        const response = await fetch(url.toString());
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch projects');
        }

        return result;
    }

    async getProjectById(id: number): Promise<ProjectResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch project');
        }

        return result;
    }

    async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create project');
        }

        return result.project;
    }

    async updateProject(id: number, data: UpdateProjectRequest): Promise<ProjectResponse> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update project');
        }

        return result.project;
    }

    async deleteProject(id: number): Promise<void> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete project');
        }
    }
}

export const projectApi = new ProjectApiService(); 