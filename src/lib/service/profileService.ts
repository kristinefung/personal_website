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

    async updateProfile(id: number, data: UpdateProfileRequest): Promise<ProfileResponse> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to update profile');
        }
        return result;
    }
}

export const profileApi = new ProfileApiService(); 