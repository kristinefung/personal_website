import React, { ReactNode, forwardRef } from "react";
import { FaTimes } from "react-icons/fa";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
    ({ isOpen, onClose, title, children, className = "", ...props }, ref) => {
        if (!isOpen) return null;
        return (
            <div
                className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50"
                onClick={onClose}
                tabIndex={-1}
                aria-modal="true"
                role="dialog"
            >
                <div
                    ref={ref}
                    className={`bg-white rounded-lg shadow-xl max-w-md w-full ${className}`}
                    style={{ maxHeight: '90vh' }}
                    onClick={e => e.stopPropagation()}
                    {...props}
                >
                    {title && (
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors text-lg cursor-pointer"
                                aria-label="Close modal"
                                type="button"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                    <div className="p-6 overflow-y-auto" style={{ maxHeight: title ? 'calc(90vh - 80px)' : '90vh' }}>
                        {children}
                    </div>
                </div>
            </div>
        );
    }
);

Modal.displayName = "Modal";

export default Modal; 