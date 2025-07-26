import { JourneyResponse, JourneyFilters } from '@/types/api';
import { authApiService } from '@/service/authApiService';

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

    async createJourney(data: any): Promise<JourneyResponse> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionToken}` },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to create journey');
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

    async deleteJourney(id: number): Promise<void> {
        const sessionToken = authApiService.getCurrentSessionToken();

        if (!sessionToken) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${sessionToken}` },
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to delete journey');
        }
    }
}

export const journeyApi = new JourneyApiService(); 