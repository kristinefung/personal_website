"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { projectApi } from "@/lib/service/projectService";
import { ProjectResponse } from "@/types/api";
import EditProjectModal from "@/app/dashboard/project/EditProjectModal";
import AddProjectModal from "@/app/dashboard/project/AddProjectModal";
import DeleteProjectModal from "@/app/dashboard/project/DeleteProjectModal";
import Table from "@/component/admin/Table";

export default function Projects() {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<ProjectResponse | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const projectData = await projectApi.getAllProjects();
            setProjects(projectData);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err instanceof Error ? err.message : 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = () => {
        setAddModalOpen(true);
    };

    const handleCreateProject = async (projectData: any) => {
        try {
            // Prepare the create data
            const createData = {
                name: projectData.name,
                description: projectData.description,
                githubUrl: projectData.githubUrl,
                projectUrl: projectData.projectUrl,
                technologies: projectData.technologies,
                imagePath: projectData.imagePath,
            };

            // Call the API to create the project
            const newProject = await projectApi.createProject(createData);

            // Add the new project to the list
            setProjects(prevProjects => [newProject, ...prevProjects]);

            console.log("Project created successfully:", newProject);
        } catch (error) {
            console.error("Error creating project:", error);
            // TODO: Show error message to user
            alert(error instanceof Error ? error.message : 'Failed to create project');
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
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setProjectToDelete(project);
            setDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            // Call the API to delete the project
            await projectApi.deleteProject(projectToDelete.id);

            // Remove the project from the list
            setProjects(prevProjects =>
                prevProjects.filter(project => project.id !== projectToDelete.id)
            );

            console.log("Project deleted successfully:", projectToDelete.name);
        } catch (error) {
            console.error("Error deleting project:", error);
            // TODO: Show error message to user
            alert(error instanceof Error ? error.message : 'Failed to delete project');
        } finally {
            // Close the modal and reset state
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleSaveProject = async (projectData: any) => {
        if (!selectedProject) return;

        try {
            // Prepare the update data
            const updateData = {
                name: projectData.name,
                description: projectData.description,
                githubUrl: projectData.githubUrl,
                projectUrl: projectData.projectUrl,
                technologies: projectData.technologies,
                imagePath: projectData.imagePath,
            };
            console.log(updateData);
            // Call the API to update the project
            const updatedProject = await projectApi.updateProject(selectedProject.id, updateData);

            // Update the projects list with the updated project
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project.id === selectedProject.id ? updatedProject : project
                )
            );

            console.log("Project updated successfully:", updatedProject);
        } catch (error) {
            console.error("Error updating project:", error);
            // TODO: Show error message to user
            alert(error instanceof Error ? error.message : 'Failed to update project');
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
                <AddProjectModal
                    isOpen={addModalOpen}
                    onClose={handleCloseAddModal}
                    onSave={handleCreateProject}
                />

                {/* Edit Project Modal */}
                <EditProjectModal
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                    project={selectedProject}
                    onSave={handleSaveProject}
                />

                {/* Delete Project Modal */}
                <DeleteProjectModal
                    isOpen={deleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    projectName={projectToDelete?.name || ''}
                />
            </div>
        </div>
    );
} 