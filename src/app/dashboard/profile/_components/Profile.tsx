"use client";
import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store";
import { UpdateProfileRequest } from "@/types/api";
import TextField from "@/component/form/TextField";
import TextArea from "@/component/form/TextArea";

export default function Profile() {
    const { profile, isLoading, error, fetchProfile, updateProfile } = useProfileStore();
    const [formData, setFormData] = useState({
        email: "",
        bio: "",
        profileImagePath: "",
        githubUrl: "",
        linkedinUrl: "",
    });
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFormData({
                email: profile.email || "",
                bio: profile.bio || "",
                profileImagePath: profile.profileImagePath || "",
                githubUrl: profile.githubUrl || "",
                linkedinUrl: profile.linkedinUrl || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile?.id) {
            alert("Profile not found");
            return;
        }

        try {
            let updatedFormData = { ...formData };

            // Upload image if a new one was selected
            if (selectedImageFile) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', selectedImageFile);

                const uploadRes = await fetch('/api/images/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });
                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    throw new Error(uploadData.error || 'Failed to upload image');
                }

                updatedFormData.profileImagePath = uploadData.path;
            }

            const updateData: UpdateProfileRequest = {
                email: updatedFormData.email,
                bio: updatedFormData.bio,
                profileImagePath: updatedFormData.profileImagePath,
                githubUrl: updatedFormData.githubUrl,
                linkedinUrl: updatedFormData.linkedinUrl,
            };

            await updateProfile(profile.id, updateData);
            setSelectedImageFile(null);
            setPreviewImageUrl(null);
            alert("Profile saved successfully!");
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to save profile');
        }
    };

    const handleChangePhoto = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setSelectedImageFile(null);
        setPreviewImageUrl(null);
        setFormData(prev => ({ ...prev, profileImagePath: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    // Get initials for avatar
    const initials = (profile?.createdByUser?.name?.[0] || "").toUpperCase();

    // Helper function to get the correct image URL
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith('/api/images')) {
            return imagePath;
        }
        return `/api/images/${imagePath}`;
    };

    return (
        <div className="py-8 px-2 m-2 md:px-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Management</h2>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Avatar and photo actions */}
                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div className="w-40 h-40 rounded-full bg-blue-900 flex items-center justify-center text-white text-5xl font-bold mb-2 overflow-hidden">
                            {previewImageUrl ? (
                                <img
                                    src={previewImageUrl}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : formData.profileImagePath ? (
                                <img
                                    src={getImageUrl(formData.profileImagePath)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleChangePhoto}
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        >
                            Change Photo
                        </button>
                    </div>
                    {/* Profile fields */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <TextField
                                cssStyle="ADMIN"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                label="Email"
                            />
                        </div>
                        <div>
                            <TextField
                                cssStyle="ADMIN"
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                label="GitHub URL"
                            />
                        </div>
                        <div>
                            <TextField
                                cssStyle="ADMIN"
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                label="LinkedIn URL"
                            />
                        </div>
                        <div>
                            <TextArea
                                cssStyle="ADMIN"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                label="Bio"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-2 text-white rounded-lg font-semibold transition-colors ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 hover:bg-gray-800'
                                    }`}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 