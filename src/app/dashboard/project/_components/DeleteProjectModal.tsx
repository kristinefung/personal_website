"use client";
import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import Modal from "@/component/Modal";

interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
}

export default function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName }: DeleteProjectModalProps) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
            <p className="text-gray-600 mb-4">
                You are about to delete the project <strong>"{projectName}"</strong>.
                This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                    Delete Project
                </button>
            </div>
        </Modal>
    );
} 