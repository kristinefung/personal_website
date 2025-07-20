"use client";
import React, { useState, useEffect } from "react";
import { authApiService } from "@/lib/service/authApiService";
import { FaUser, FaSignOutAlt, FaHome, FaCog, FaProjectDiagram, FaChartBar } from "react-icons/fa";

interface UserInfo {
    id: number;
    name: string;
    email: string;
}

export default function Dashboard() {
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

            // For now, we'll extract user info from the JWT token
            // In a real app, you might want to fetch user details from an API
            const token = authApiService.getCurrentSessionToken();
            if (token) {
                // This is a simplified approach - ideally you'd have a proper user info endpoint
                setUser({
                    id: 1, // Would come from JWT or API
                    name: "User", // Would come from JWT or API
                    email: "user@example.com" // Would come from JWT or API
                });
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authApiService.logout();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout even if API call fails
            window.location.href = '/login';
        }
    };

    const handleNavigation = (path: string) => {
        window.location.href = path;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7fffd4]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a1628] py-8 px-4 md:px-8 text-white">
            dashboard
        </div>
    );
} 