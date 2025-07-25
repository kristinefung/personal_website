"use client";
import React from "react";

interface DeleteJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    journeyTitle: string;
}

export default function DeleteJourneyModal({ isOpen, onClose, onConfirm, journeyTitle }: DeleteJourneyModalProps) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Delete Journey</h2>
                </div>
                <div className="p-6">
                    <p className="mb-4 text-gray-700">
                        Are you sure you want to delete <span className="font-bold">{journeyTitle}</span>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 