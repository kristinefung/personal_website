"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store";
import AdminSidebar from "@/component/admin/Sidebar";
import Header from "@/component/admin/Header";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    userName?: string;
    userRole?: string;
    userInitials?: string;
}

export default function AdminLayout({
    children,
    title = "Dashboard",
}: AdminLayoutProps) {
    const { user, isLoading: authLoading, checkAuth, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const isAuthenticated = checkAuth();
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            // Force redirect even if logout fails
            window.location.href = '/login';
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Show loading spinner while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7fffd4]"></div>
            </div>
        );
    }

    if (!user) {
        return null; // This shouldn't happen as we redirect to login, but just in case
    }

    return (
        <main className="bg-[#f0f4f8] min-h-screen">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                onLogout={handleLogout}
            />
            <div className="flex-1 lg:ml-64">
                <Header
                    title={title}
                    userName={user.name}
                    userInitials={user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={toggleSidebar}
                />
                <div className="pt-20">
                    {children}
                </div>
            </div>
        </main>
    );
} 