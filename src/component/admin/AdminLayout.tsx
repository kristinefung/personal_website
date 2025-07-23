"use client";

import { useState, useEffect } from "react";
import { authApiService } from "@/lib/service/authApiService";
import AdminSidebar from "@/component/admin/Sidebar";
import Header from "@/component/admin/Header";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    userName?: string;
    userRole?: string;
    userInitials?: string;
}

interface UserInfo {
    id: number;
    name: string;
    email: string;
}

export default function AdminLayout({
    children,
    title = "Dashboard",
    userName = "John Doe",
    userRole = "Administrator",
    userInitials = "JD"
}: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const validation = await authApiService.validateLocalSession();

            if (!validation.valid) {
                // Redirect to login if session is invalid
                window.location.href = '/login';
                return;
            }

            // Fetch user info from API
            const userInfo = await authApiService.getCurrentUser();
            setUser(userInfo);
        } catch (error) {
            console.error('Authentication check failed:', error);
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7fffd4]"></div>
            </div>
        );
    }

    // Only render the admin layout if user is authenticated
    if (!user) {
        return null; // This shouldn't happen as we redirect to login, but just in case
    }

    return (
        <main className="bg-[#f0f4f8] min-h-screen">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
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