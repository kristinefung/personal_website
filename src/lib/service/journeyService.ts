import { JourneyResponse, JourneyFilters } from '@/types/api';

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

}

export const journeyApi = new JourneyApiService(); 