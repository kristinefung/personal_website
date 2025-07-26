"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useJourneyStore, useSnackbarStore } from "@/store";
import Table from "@/component/admin/Table";
import JourneyFormModal from "./JourneyFormModal";
import DeleteJourneyModal from "./DeleteJourneyModal";

export default function Journeys() {
    const {
        journeys,
        isLoading: loading,
        error,
        selectedJourney,
        fetchJourneys,
        addJourney: createJourney,
        updateJourney,
        deleteJourney,
        setSelectedJourney
    } = useJourneyStore();
    const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarStore();

    // Modal state
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [journeyToDelete, setJourneyToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchJourneys();
    }, [fetchJourneys]);

    const handleAddJourney = () => setAddModalOpen(true);

    const handleEditJourney = (id: number) => {
        const journey = journeys.find(j => j.id === id);
        if (journey) {
            setSelectedJourney(journey);
            setEditModalOpen(true);
        }
    };

    const handleDeleteJourney = (id: number) => {
        setJourneyToDelete(id);
        setDeleteModalOpen(true);
    };

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
            await updateJourney(selectedJourney.id, journeyData);
            handleCloseEditModal();
            showSuccessSnackbar("Journey updated successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to update journey');
        }
    };

    const handleCreateJourney = async (journeyData: any) => {
        try {
            await createJourney(journeyData);
            handleCloseAddModal();
            showSuccessSnackbar("Journey created successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to create journey');
        }
    };

    const handleConfirmDelete = async () => {
        if (!journeyToDelete) return;
        try {
            await deleteJourney(journeyToDelete);
            handleCloseDeleteModal();
            showSuccessSnackbar("Journey deleted successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to delete journey');
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
                <JourneyFormModal
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    onSave={handleCreateJourney}
                    mode="ADD"
                />
                <JourneyFormModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveJourney}
                    mode="EDIT"
                    journey={selectedJourney}
                />
                <DeleteJourneyModal
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    journeyTitle={journeys.find(j => j.id === journeyToDelete)?.title || ''}
                />
            </div>
        </div>
    );
} 