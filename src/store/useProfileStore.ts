import { create } from 'zustand';
import { ProfileResponse, UpdateProfileRequest } from '@/types/api';
import { profileApi } from '@/service/profileService';

interface ProfileState {
    profile: ProfileResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (id: number, profileData: Partial<UpdateProfileRequest>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,
    fetchProfile: async () => {
        try {
            set({ isLoading: true, error: null });
            const data = await profileApi.getMainProfile();
            set({ profile: data, isLoading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to load profile', isLoading: false });
        }
    },
    updateProfile: async (id, profileData) => {
        try {
            set({ isLoading: true, error: null });
            const updatedProfile = await profileApi.updateProfile(id, profileData);
            set({ profile: updatedProfile, isLoading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to update profile', isLoading: false });
        }
    }
})); 