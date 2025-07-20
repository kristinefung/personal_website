import Dashboard from "./Dashboard";
import AdminSidebar from "@/component/admin/Sidebar";
export default function DashboardPage() {
    return (
        <main className="bg-[#0a1628] min-h-screen">
            <AdminSidebar />
            <Dashboard />
        </main>
    );
} 