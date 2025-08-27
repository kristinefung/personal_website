"use client";
import React, { useState, useEffect } from 'react';
import { FaCode, FaChartBar, FaMobileAlt, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from 'next/image';
import { projectApi } from '@/service/projectService';
import { ProjectResponse } from '@/types/api';

// Default icons for projects without specific icons
const defaultIcons = [
    <FaCode size={64} className="text-teal-300 mx-auto mb-6" />,
    <FaChartBar size={64} className="text-teal-300 mx-auto mb-6" />,
    <FaMobileAlt size={64} className="text-teal-300 mx-auto mb-6" />,
];

export default function Project() {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const projectData = await projectApi.getAllProjects();
                setProjects(projectData);
                setError(null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err instanceof Error ? err.message : 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Helper function to get the full image URL
    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) return "/square-placeholder.jpg";

        // Otherwise, serve from API route
        return `/api/images/${imagePath}`;
    };

    if (loading) {
        return (
            <section id="projects" className="py-24 px-16 bg-[#112240] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Projects</h2>
                <div className="h-1 w-32 bg-teal-300 mb-10" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0b192f] rounded-xl shadow-lg overflow-hidden flex flex-col justify-between min-h-[350px] animate-pulse"
                        >
                            <div className="flex-1 flex flex-col justify-center items-center p-8 pb-0">
                                <div className="w-16 h-16 bg-gray-700 rounded mb-6"></div>
                            </div>
                            <div className="p-8 pt-0">
                                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="projects" className="py-24 px-16 bg-[#112240] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Projects</h2>
                <div className="h-1 w-32 bg-teal-300 mb-10" />
                <p className="text-red-400 text-lg">
                    {error}
                </p>
            </section>
        );
    }

    if (projects.length === 0) {
        return (
            <section id="projects" className="py-24 px-16 bg-[#112240] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Projects</h2>
                <div className="h-1 w-32 bg-teal-300 mb-10" />
                <p className="text-gray-400 text-lg">
                    No projects available at the moment.
                </p>
            </section>
        );
    }

    return (
        <section id="projects" className="py-24 px-16 bg-[#112240] w-full">
            <h2 className="text-4xl font-bold text-white mb-2">My Projects</h2>
            <div className="h-1 w-32 bg-teal-300 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => {
                    const imageUrl = getImageUrl(project.imagePath);
                    const defaultIcon = defaultIcons[idx % defaultIcons.length];

                    return (
                        <div
                            key={project.id}
                            className="bg-[#0b192f] rounded-xl shadow-lg overflow-hidden flex flex-col justify-between min-h-[350px]"
                        >
                            <div className="flex-1 flex flex-col justify-center items-center p-0">
                                <div className="w-full h-[200px] mb-6 relative overflow-hidden rounded-lg">
                                    <Image
                                        src={imageUrl}
                                        alt={project.name}
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                            <div className="p-8 pt-0">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-xl font-bold text-white flex-1">
                                        {project.name}
                                    </h3>
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-teal-300 mr-3"
                                        >
                                            <FaGithub />
                                        </a>
                                    )}
                                    {project.projectUrl && (
                                        <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-teal-300"
                                        >
                                            <FaExternalLinkAlt />
                                        </a>
                                    )}
                                </div>
                                <p className="text-gray-300 mb-4 text-base">
                                    {project.description || 'No description available'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.MappingProjectTechnology.map((mapping) => (
                                        <span
                                            key={mapping.id}
                                            className="bg-[#ffffff11] text-teal-200 px-3 py-1 rounded-md text-sm font-medium"
                                            style={{
                                                borderColor: mapping.technology.color,
                                                color: mapping.technology.color
                                            }}
                                        >
                                            {mapping.technology.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
} 