"use client";

import { useEffect, useState } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useSnackbarStore } from '@/store';

export type SnackbarType = 'success' | 'error';

interface SnackbarProps { }

const getIcon = (type: SnackbarType) => {
    switch (type) {
        case 'success':
            return <FaCheckCircle className="w-5 h-5 text-green-500" />;
        case 'error':
            return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
        default:
            return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
    }
};

const getBackgroundColor = (type: SnackbarType) => {
    switch (type) {
        case 'success':
            return 'bg-green-50 border-green-200';
        case 'error':
            return 'bg-red-50 border-red-200';
        default:
            return 'bg-blue-50 border-blue-200';
    }
};

const getTextColor = (type: SnackbarType) => {
    switch (type) {
        case 'success':
            return 'text-green-800';
        case 'error':
            return 'text-red-800';
        default:
            return 'text-blue-800';
    }
};


export default function Snackbar({ }: SnackbarProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Store values
    const store = useSnackbarStore();
    const storeIsOpen = store.isOpen;
    const storeMessage = store.message;
    const storeType = store.type;
    const storeHideSnackbar = store.hideSnackbar;

    // Use store values if useStore is true, otherwise use props
    const isOpen = storeIsOpen;
    const message = storeMessage;
    const type = storeType;
    const onClose = storeHideSnackbar;

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={`fixed z-50 top-2 right-2`}>
            <div
                className={`
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                    transition-all duration-300 ease-in-out
                    max-w-sm w-full
                    ${getBackgroundColor(type)}
                    border rounded-lg shadow-lg
                    p-4
                    flex items-start space-x-3
                `}
            >
                <div className="flex-shrink-0">
                    {getIcon(type)}
                </div>
                <div className={`flex-1 ${getTextColor(type)}`}>
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
} 