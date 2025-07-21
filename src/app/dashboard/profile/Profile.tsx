"use client";
import React, { useState, useEffect } from "react";
import { profileApi } from "@/lib/service/profileService";
import { ProfileResponse } from "@/types/api";

export default function Profile() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        bio: "",
        profileImagePath: "",
        githubUrl: "",
        linkedinUrl: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileApi.getMainProfile();
            setProfile(data);
            setFormData({
                email: data.email || "",
                bio: data.bio || "",
                profileImagePath: data.profileImagePath || "",
                githubUrl: data.githubUrl || "",
                linkedinUrl: data.linkedinUrl || "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement update profile API call
        alert("Save functionality not implemented");
    };

    const handleChangePhoto = () => {
        // TODO: Implement change photo logic
        alert("Change photo not implemented");
    };

    const handleRemovePhoto = () => {
        setFormData(prev => ({ ...prev, profileImagePath: "" }));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    // Get initials for avatar
    const initials = (profile?.createdByUser?.name?.[0] || "").toUpperCase();

    return (
        <div className="py-8 px-2 m-2 md:px-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Management</h2>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Avatar and photo actions */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-40 h-40 rounded-full bg-blue-900 flex items-center justify-center text-white text-5xl font-bold mb-2">
                            {initials}
                        </div>
                        <button
                            type="button"
                            onClick={handleChangePhoto}
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Change Photo
                        </button>
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="w-full px-4 py-2 bg-teal-300 text-gray-900 rounded-lg font-semibold hover:bg-teal-400 transition-colors"
                        >
                            Remove Photo
                        </button>
                    </div>
                    {/* Profile fields */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 