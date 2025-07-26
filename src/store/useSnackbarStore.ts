import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SnackbarType } from '@/component/ui/Snackbar';

interface SnackbarState {
    isOpen: boolean;
    message: string;
    type: SnackbarType;
    hideSnackbar: () => void;
    showSuccessSnackbar: (message: string) => void;
    showErrorSnackbar: (message: string) => void;
}

export const useSnackbarStore = create<SnackbarState>()(
    devtools(
        (set) => ({
            isOpen: false,
            message: '',
            type: 'success',
            hideSnackbar: () => {
                set({ isOpen: false });
            },
            showSuccessSnackbar: (message: string) => {
                set({ isOpen: true, message, type: 'success' });
            },
            showErrorSnackbar: (message: string) => {
                set({ isOpen: true, message, type: 'error' });
            }
        })
    )
); 