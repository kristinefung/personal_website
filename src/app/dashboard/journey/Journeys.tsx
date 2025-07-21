"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { journeyApi } from "@/lib/service/journeyService";
import { JourneyResponse } from "@/types/api";
import Table from "@/component/admin/Table";
import EditJourneyModal from "./EditJourneyModal";

export default function Journeys() {
    const [journeys, setJourneys] = useState<JourneyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Modal state placeholders
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedJourney, setSelectedJourney] = useState<JourneyResponse | null>(null);
    const [journeyToDelete, setJourneyToDelete] = useState<JourneyResponse | null>(null);

    useEffect(() => {
        fetchJourneys();
    }, []);

    const fetchJourneys = async () => {
        try {
            setLoading(true);
            setError(null);
            const journeyData = await journeyApi.getAllJourneys();
            setJourneys(journeyData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load journeys');
        } finally {
            setLoading(false);
        }
    };

    const handleAddJourney = () => setAddModalOpen(true);
    const handleEditJourney = (id: number) => {
        const journey = journeys.find(j => j.id === id);
        if (journey) {
            setSelectedJourney(journey);
            setEditModalOpen(true);
        }
    };
    const handleDeleteJourney = (id: number) => {
        const journey = journeys.find(j => j.id === id);
        if (journey) {
            setJourneyToDelete(journey);
            setDeleteModalOpen(true);
        }
    };
    // Placeholder handlers for modals
    const handleCloseAddModal = () => setAddModalOpen(false);
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedJourney(null);
    };
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setJourneyToDelete(null);
    };

    const handleSaveJourney = async (journeyData: any) => {
        if (!selectedJourney) return;
        try {
            // Call the API to update the journey (assume journeyApi.updateJourney exists)
            const updatedJourney = await journeyApi.updateJourney(selectedJourney.id, journeyData);
            setJourneys(prev => prev.map(j => j.id === selectedJourney.id ? updatedJourney : j));
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update journey');
        }
    };

    const formatYearRange = (startYear: number, endYear: number | null, isCurrent: boolean) => {
        if (isCurrent) return `${startYear} - Present`;
        return endYear ? `${startYear} - ${endYear}` : `${startYear}`;
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
                    <h2 className="text-2xl font-bold text-gray-900">Manage Journey</h2>
                    <button
                        onClick={handleAddJourney}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                    >
                        <FaPlus className="text-sm" />
                        Add Entry
                    </button>
                </div>
                <Table
                    columns={[
                        {
                            key: "period",
                            header: "PERIOD",
                            render: (journey) => formatYearRange(journey.startYear, journey.endYear, journey.isCurrent),
                        },
                        {
                            key: "title",
                            header: "TITLE",
                            render: (journey) => <span className="font-bold text-lg">{journey.title}</span>,
                        },
                        {
                            key: "institution",
                            header: "INSTITUTION",
                        },
                        {
                            key: "actions",
                            header: "ACTIONS",
                            render: (journey) => (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEditJourney(journey.id)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 cursor-pointer"
                                        title="Edit Entry"
                                    >
                                        <FaEdit className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteJourney(journey.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors p-1 cursor-pointer"
                                        title="Delete Entry"
                                    >
                                        <FaTrash className="text-lg" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={journeys}
                    rowKey={j => j.id}
                    emptyState={<div className="text-gray-500">No journey entries yet.</div>}
                />
                <EditJourneyModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    journey={selectedJourney}
                    onSave={handleSaveJourney}
                />
            </div>
        </div>
    );
} 