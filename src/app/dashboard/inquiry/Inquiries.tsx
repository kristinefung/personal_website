"use client";
import React, { useState, useEffect } from "react";
import { enquiryApi } from "@/service/enquiryService";
import { EnquiryResponse } from "@/types/api";
import Table from "@/component/admin/Table";

export default function Inquiries() {
    const [inquiries, setInquiries] = useState<EnquiryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await enquiryApi.getEnquiries();
            setInquiries(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    return (
        <div className="py-8 px-2 m-2 md:px-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Inquiries</h2>
                </div>
                <Table
                    columns={[
                        { key: "name", header: "NAME" },
                        { key: "email", header: "EMAIL" },
                        { key: "subject", header: "SUBJECT" },
                        { key: "message", header: "MESSAGE" },
                        {
                            key: "createdAt",
                            header: "RECEIVED",
                            render: (row) => {
                                const d = new Date(row.createdAt);
                                const day = String(d.getDate()).padStart(2, '0');
                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                const year = d.getFullYear();
                                const hours = String(d.getHours()).padStart(2, '0');
                                const minutes = String(d.getMinutes()).padStart(2, '0');
                                const seconds = String(d.getSeconds()).padStart(2, '0');
                                return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
                            },
                        },
                    ]}
                    data={inquiries}
                    rowKey={i => i.id}
                    emptyState={<div className="text-gray-500">No inquiries yet.</div>}
                />
            </div>
        </div>
    );
} 