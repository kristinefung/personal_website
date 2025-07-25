"use client";

import Header from "@/component/customer/Header";
import Login from "@/app/login/_components/Login";
import Footer from "@/component/customer/Footer";
import { authApiService } from "@/service/authApiService";
import { useEffect } from "react";

export default function LoginPage() {


    useEffect(() => {
        if (typeof window !== 'undefined' && authApiService.isLoggedIn()) {
            window.location.href = '/dashboard';
        }
    }, []);

    return (
        <>
            <main className="bg-[#0a1628] min-h-screen">
                <Login />
            </main>
        </>
    );
} 