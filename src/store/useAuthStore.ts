import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApiService } from '@/service/authApiService';
import { LoginRequest } from '@/types/auth';

interface UserInfo {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
    setUser: (user: UserInfo) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
            login: async (credentials: LoginRequest) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await authApiService.login(credentials);

                    if (response.success) {
                        // Fetch user info after successful login
                        const userInfo = await authApiService.getCurrentUser();
                        set({
                            isAuthenticated: true,
                            user: userInfo,
                            isLoading: false
                        });
                    } else {
                        set({
                            isAuthenticated: false,
                            user: null,
                            isLoading: false
                        });
                    }
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to login',
                        isLoading: false,
                        isAuthenticated: false,
                        user: null
                    });
                    throw err;
                }
            },
            logout: async () => {
                try {
                    set({ isLoading: true, error: null });
                    await authApiService.logout();
                    set({
                        isAuthenticated: false,
                        user: null,
                        isLoading: false
                    });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to logout',
                        isLoading: false
                    });
                    throw err;
                }
            },
            checkAuth: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await authApiService.validateLocalSession();

                    if (response.valid) {
                        // Fetch user info if session is valid
                        const userInfo = await authApiService.getCurrentUser();
                        set({
                            isAuthenticated: true,
                            user: userInfo,
                            isLoading: false
                        });
                        return true;
                    } else {
                        set({
                            isAuthenticated: false,
                            user: null,
                            isLoading: false
                        });
                        return false;
                    }
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Failed to check authentication',
                        isLoading: false,
                        isAuthenticated: false,
                        user: null
                    });
                    return false;
                }
            },
            setUser: (user: UserInfo) => {
                set({ user });
            }
        })
    )
); 