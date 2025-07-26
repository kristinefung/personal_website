"use client";

import React from "react";
import { FaSignOutAlt, FaTachometerAlt, FaProjectDiagram, FaRocket, FaEnvelope, FaUser } from "react-icons/fa";
import { useAuthStore } from "@/store";

const adminNavLinks = [
    { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
    { name: "Projects", href: "/dashboard/project", icon: FaProjectDiagram },
    { name: "Journey", href: "/dashboard/journey", icon: FaRocket },
    { name: "Inquiries", href: "/dashboard/inquiry", icon: FaEnvelope },
    { name: "Profile", href: "/dashboard/profile", icon: FaUser },
];

interface AdminSidebarProps {
    currentPath?: string;
    onLogout?: () => void;
    sidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

export default function AdminSidebar({
    onLogout,
    sidebarOpen = false,
    onToggleSidebar
}: AdminSidebarProps) {
    const { logout, isLoading } = useAuthStore();

    const handleLogout = async () => {
        if (onLogout) {
            onLogout();
        } else {
            try {
                await logout();
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout failed:', error);
                // Force redirect even if logout fails
                window.location.href = '/login';
            }
        }
    };

    const isActive = (href: string) => {
        return window.location.pathname === href;
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-64 bg-[#112240] border-r border-gray-700 z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}>

                {/* Logo/Brand */}
                <div className="px-6 py-6 border-b border-gray-700">
                    <div className="text-xl font-bold text-[#7fffd4] font-mono">
                        &lt;Admin/&gt;
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col py-6 px-4 flex-1">
                    {adminNavLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => onToggleSidebar && onToggleSidebar()}
                                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200 text-sm font-medium 
                                    ${isActive(link.href)
                                        ? 'text-[#7fffd4] bg-[#7fffd4]/5'
                                        : 'text-gray-300 hover:text-[#7fffd4] hover:bg-[#7fffd4]/5'
                                    }`}
                            >
                                <IconComponent className="text-lg flex-shrink-0" />
                                {link.name}
                            </a>
                        );
                    })}
                </nav>

                {/* Logout Button at Bottom */}
                <div className="px-4 pb-6 border-t border-gray-700 pt-4">
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium border ${isLoading
                            ? 'bg-gray-600/20 text-gray-400 border-gray-600/30 cursor-not-allowed'
                            : 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 hover:text-red-300'
                            }`}
                    >
                        <FaSignOutAlt className="text-lg flex-shrink-0" />
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={onToggleSidebar}
                ></div>
            )}
        </>
    );
} 