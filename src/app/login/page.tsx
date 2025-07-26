"use client";

import Login from "@/app/login/_components/Login";
import { useAuthStore } from "@/store";
import { useEffect, useRef } from "react";

export default function LoginPage() {
    const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
    const hasCheckedAuth = useRef(false);
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!hasCheckedAuth.current) {
            hasCheckedAuth.current = true;
            checkAuth();
        }
    }, []); // Only run once on mount

    useEffect(() => {
        // Only redirect if we're not loading, authenticated, and haven't redirected yet
        if (!authLoading && isAuthenticated && !hasRedirected.current) {
            console.log("Redirecting to dashboard - isAuthenticated:", isAuthenticated, "authLoading:", authLoading);
            hasRedirected.current = true;
            window.location.href = '/dashboard';
        }
    }, [isAuthenticated, authLoading]);

    return (
        <>
            <main className="bg-[#0a1628] min-h-screen">
                <Login />
            </main>
        </>
    );
} 