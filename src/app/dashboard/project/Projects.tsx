"use client";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { projectApi } from "@/lib/service/projectService";
import { ProjectResponse } from "@/types/api";
import EditProjectModal from "@/app/dashboard/project/EditProjectModal";

export default function Projects() {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);

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
        // TODO: Implement add project functionality
        console.log("Add Project clicked");
    };

    const handleEditProject = (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setEditModalOpen(true);
        }
    };

    const handleDeleteProject = (projectId: number) => {
        // TODO: Implement delete project functionality
        console.log("Delete Project clicked for ID:", projectId);
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
            };

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

    const handleCloseModal = () => {
        setEditModalOpen(false);
        setSelectedProject(null);
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
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-medium text-gray-700 uppercase tracking-wider text-sm">
                                            PROJECT
                                        </th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-700 uppercase tracking-wider text-sm">
                                            TECHNOLOGIES
                                        </th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-700 uppercase tracking-wider text-sm">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
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
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.MappingProjectTechnology.map((mapping) => (
                                                        <span key={mapping.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                            {mapping.technology.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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

                {/* Edit Project Modal */}
                <EditProjectModal
                    isOpen={editModalOpen}
                    onClose={handleCloseModal}
                    project={selectedProject}
                    onSave={handleSaveProject}
                />
            </div>
        </div>
    );
} 