import { TechnologyResponse } from '@/types/api';
import { authApiService } from '@/service/authApiService';

interface CreateTechnologyRequest {
    name: string;
    color: string;
}

class TechnologyApiService {
    private baseUrl = '/api/technologies';

    async getAllTechnologies(): Promise<TechnologyResponse[]> {
        const response = await fetch(this.baseUrl);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch technologies');
        }

        return result;
    }

    async createTechnology(data: CreateTechnologyRequest): Promise<TechnologyResponse> {
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
            throw new Error(result.error || 'Failed to create technology');
        }

        return result.technology;
    }

    async findOrCreateTechnologies(technologyNames: string[]): Promise<TechnologyResponse[]> {
        if (!technologyNames.length) return [];

        // Get all existing technologies
        const allTechnologies = await this.getAllTechnologies();

        const result: TechnologyResponse[] = [];
        const toCreate: string[] = [];

        // Check which technologies already exist
        for (const name of technologyNames) {
            const existing = allTechnologies.find(tech =>
                tech.name.toLowerCase() === name.trim().toLowerCase()
            );

            if (existing) {
                result.push(existing);
            } else {
                toCreate.push(name.trim());
            }
        }

        // Create new technologies
        for (const name of toCreate) {
            try {
                const newTech = await this.createTechnology({
                    name,
                    color: this.generateRandomColor()
                });
                result.push(newTech);
            } catch (error) {
                console.error(`Failed to create technology ${name}:`, error);
                // Continue with other technologies
            }
        }

        return result;
    }

    private generateRandomColor(): string {
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
            '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

export const technologyApi = new TechnologyApiService(); 