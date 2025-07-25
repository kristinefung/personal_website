"use client";
import React from "react";
import Modal from "@/component/Modal";

interface DeleteJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    journeyTitle: string;
}

export default function DeleteJourneyModal({ isOpen, onClose, onConfirm, journeyTitle }: DeleteJourneyModalProps) {
    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Journey">
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
        </Modal>
    );
} 