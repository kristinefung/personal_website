"use client";

import { useState } from "react";
import Dashboard from "./Dashboard";
import AdminSidebar from "@/component/admin/Sidebar";
import Header from "@/component/admin/Header";

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <main className="bg-[#0a1628] min-h-screen">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
            />
            <div className="flex-1 lg:ml-64">
                <Header
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={toggleSidebar}
                />
                <Dashboard />
            </div>
        </main>
    );
} 