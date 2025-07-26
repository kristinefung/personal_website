"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useProjectStore, useSnackbarStore } from "@/store";
import ProjectFormModal from "@/app/dashboard/project/_components/ProjectFormModal";
import DeleteProjectModal from "@/app/dashboard/project/_components/DeleteProjectModal";
import Table from "@/component/admin/Table";

export default function Projects() {
    const {
        projects,
        isLoading: loading,
        error,
        selectedProject,
        fetchProjects,
        addProject: createProject,
        updateProject,
        deleteProject,
        setSelectedProject
    } = useProjectStore();
    const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarStore();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleAddProject = () => {
        setAddModalOpen(true);
    };

    const handleCreateProject = async (projectData: any) => {
        try {
            await createProject(projectData);
            handleCloseAddModal();
            showSuccessSnackbar("Project created successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to create project');
        }
    };

    const handleEditProject = (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setEditModalOpen(true);
        }
    };

    const handleDeleteProject = (projectId: number) => {
        setProjectToDelete(projectId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProject(projectToDelete);
            handleCloseDeleteModal();
            showSuccessSnackbar("Project deleted successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to delete project');
        }
    };

    const handleSaveProject = async (projectData: any) => {
        if (!selectedProject) return;

        try {
            await updateProject(selectedProject.id, projectData);
            handleCloseEditModal();
            showSuccessSnackbar("Project updated successfully!");
        } catch (error) {
            showErrorSnackbar(error instanceof Error ? error.message : 'Failed to update project');
        }
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedProject(null);
    };

    const handleCloseAddModal = () => {
        setAddModalOpen(false);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setProjectToDelete(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-red-800 font-medium mb-2">Error Loading Projects</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchProjects}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-2 m-2 md:px-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Projects</h2>
                    <button
                        onClick={handleAddProject}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                    >
                        <FaPlus className="text-sm" />
                        Add Project
                    </button>
                </div>
                {/* Projects Table */}
                {projects.length > 0 ? (
                    <Table
                        columns={[
                            {
                                key: "name",
                                header: "PROJECT",
                                render: (project) => (
                                    <div>
                                        <div className="font-semibold text-gray-900 text-base">
                                            {project.name}
                                        </div>
                                        {project.description && (
                                            <div className="text-gray-500 text-sm mt-1">
                                                {project.description}
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                key: "technologies",
                                header: "TECHNOLOGIES",
                                render: (project) => (
                                    <div className="flex flex-wrap gap-2">
                                        {project.MappingProjectTechnology.map((mapping) => (
                                            <span key={mapping.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {mapping.technology.name}
                                            </span>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                key: "actions",
                                header: "ACTIONS",
                                render: (project) => (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEditProject(project.id)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 cursor-pointer"
                                            title="Edit Project"
                                        >
                                            <FaEdit className="text-lg" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors p-1 cursor-pointer"
                                            title="Delete Project"
                                        >
                                            <FaTrash className="text-lg" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={projects}
                        rowKey={(project) => project.id}
                    />
                ) : (
                    /* Empty State */
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-gray-400 mb-4">
                            <FaPlus className="text-4xl mx-auto mb-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                        <button
                            onClick={handleAddProject}
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Create Project
                        </button>
                    </div>
                )}

                {/* Add Project Modal */}
                <ProjectFormModal
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    onSave={handleCreateProject}
                    mode="ADD"
                />

                {/* Edit Project Modal */}
                <ProjectFormModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveProject}
                    mode="EDIT"
                    project={selectedProject}
                />

                {/* Delete Project Modal */}
                <DeleteProjectModal
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    projectName={projects.find(p => p.id === projectToDelete)?.name || ''}
                />
            </div>
        </div>
    );
} 