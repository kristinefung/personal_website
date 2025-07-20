import { ProjectResponse, ProjectFilters } from '@/types/api';

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
}

export const projectApi = new ProjectApiService(); 