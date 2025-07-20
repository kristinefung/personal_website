"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { profileApi } from '@/lib/service/profileService';
import { ProfileResponse } from '@/types/api';

export default function About() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profileData = await profileApi.getMainProfile();
                setProfile(profileData);
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Helper function to get the full image URL
    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) return "/square-placeholder.jpg";

        return `/api/images${imagePath}`;
    };

    if (loading) {
        return (
            <section id="about" className="px-16 w-full flex flex-col md:flex-row items-center md:items-start justify-between py-12">
                <div className="flex-1 md:mr-12">
                    <h2 className="text-4xl font-bold text-gray-100 mb-2">About Me</h2>
                    <div className="w-24 h-1 bg-[#7fffd4] mb-8" />
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded mb-6 w-3/4"></div>
                    </div>
                </div>
                <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0">
                    <div className="animate-pulse bg-gray-700 w-80 h-80 rounded"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="about" className="px-16 w-full flex flex-col md:flex-row items-center md:items-start justify-between py-12">
                <div className="flex-1 md:mr-12">
                    <h2 className="text-4xl font-bold text-gray-100 mb-2">About Me</h2>
                    <div className="w-24 h-1 bg-[#7fffd4] mb-8" />
                    <p className="text-red-400 text-lg">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    // Extract technologies from profile
    const technologies = profile?.MappingProfileTechnology?.map(mapping => mapping.technology) || [];

    // Split technologies into two columns for display
    const midpoint = Math.ceil(technologies.length / 2);
    const techColumns = [
        technologies.slice(0, midpoint),
        technologies.slice(midpoint)
    ];

    const imageUrl = getImageUrl(profile?.profileImagePath);

    return (
        <section id="about" className="px-16 w-full flex flex-col md:flex-row items-center md:items-start justify-between py-12">
            <div className="flex-1 md:mr-12">
                <h2 className="text-4xl font-bold text-gray-100 mb-2">About Me</h2>
                <div className="w-24 h-1 bg-[#7fffd4] mb-8" />

                {/* Dynamic bio content */}
                <div className="text-gray-400 text-lg mb-6 whitespace-pre-line">
                    {profile?.bio || 'No bio available'}
                </div>

                {/* Technologies section */}
                {technologies.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-lg text-gray-100 font-mono mb-8">
                            {techColumns.map((col, i) => (
                                <ul key={i} className="list-none">
                                    {col.map((tech) => (
                                        <li key={tech.id} className="flex items-center mb-1">
                                            <span
                                                className="mr-2"
                                                style={{ color: '#7fffd4' }}
                                            >
                                                ▸
                                            </span>
                                            {tech.name}
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 flex justify-center md:justify-end mt-6 md:mt-0">
                <Image
                    src={imageUrl}
                    alt="Profile"
                    width={320}
                    height={320}
                    className="object-cover w-80 h-80 rounded-lg"
                />
            </div>
        </section>
    );
} 