import { CreateProfileRequest, UpdateProfileRequest, ProfileResponse, CreateProfileResponse } from '@/types/api';

class ProfileApiService {
    private baseUrl = '/api/profiles';

    async getMainProfile(): Promise<ProfileResponse> {
        const response = await fetch(`${this.baseUrl}?first=true`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch profile');
        }

        return result;
    }
}

export const profileApi = new ProfileApiService(); 