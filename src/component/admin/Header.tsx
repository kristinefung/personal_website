import React from 'react';
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
    title?: string;
    userName?: string;
    userInitials?: string;
    sidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title = "",
    userName = "",
    userInitials = "",
    sidebarOpen = false,
    onToggleSidebar
}) => {
    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-[#f0f4f8] shadow-sm border-b border-gray-200 px-6 py-4 z-30">
            <div className="flex items-center justify-between">
                {/* Left side - Toggle and Title */}
                <div className="flex items-center space-x-4">
                    {/* Mobile toggle button */}
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                </div>

                {/* Right side - User info */}
                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{userName}</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{userInitials}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 