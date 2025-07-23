import { JourneyResponse, JourneyFilters } from '@/types/api';
import { authApiService } from './authApiService';
class JourneyApiService {
    private baseUrl = '/api/journeys';

    async getAllJourneys(): Promise<JourneyResponse[]> {
        const url = new URL(this.baseUrl, window.location.origin);
        const response = await fetch(url.toString());
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch journeys');
        }

        return result;
    }

    async getJourneyById(id: number): Promise<JourneyResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch journey');
        }

        return result;
    }

    async updateJourney(id: number, data: any): Promise<JourneyResponse> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionToken}` },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to update journey');
        }
        return result;
    }
}

export const journeyApi = new JourneyApiService(); 