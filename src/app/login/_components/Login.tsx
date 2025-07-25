"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authApiService } from "@/service/authApiService";
import { LoginRequest } from "@/types/auth";
import TextField from "@/component/admin/form/TextField";
import PasswordTextField from "@/component/admin/form/PasswordTextField";

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface LoginStatus {
    isSubmitting: boolean;
    message: string;
    isError: boolean;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false
    });

    const [status, setStatus] = useState<LoginStatus>({
        isSubmitting: false,
        message: '',
        isError: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password.trim()) {
            setStatus({
                isSubmitting: false,
                message: 'Please fill in all required fields',
                isError: true
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setStatus({
                isSubmitting: false,
                message: 'Please enter a valid email address',
                isError: true
            });
            return;
        }

        setStatus({
            isSubmitting: true,
            message: '',
            isError: false
        });

        try {
            const loginData: LoginRequest = {
                email: formData.email.trim(),
                password: formData.password,
                rememberMe: formData.rememberMe
            };

            const response = await authApiService.login(loginData);

            if (response.success) {
                setStatus({
                    isSubmitting: false,
                    message: 'Login successful! Redirecting...',
                    isError: false
                });

                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    rememberMe: false
                });

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                throw new Error(response.message || 'Login failed');
            }

        } catch (error) {
            setStatus({
                isSubmitting: false,
                message: error instanceof Error ? error.message : 'Login failed. Please check your credentials.',
                isError: true
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-md w-full">
                <h1 className="text-4xl font-bold text-white mb-2 text-center">Welcome Back</h1>
                <p className="text-gray-400 mb-8 text-center">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} autoComplete="on" noValidate className="bg-[#112240] rounded-lg p-8 w-full flex flex-col gap-6 shadow-lg">
                    {status.message && (
                        <div className={`p-4 rounded-lg text-center ${status.isError
                            ? 'bg-red-900/50 text-red-200 border border-red-700'
                            : 'bg-green-900/50 text-green-200 border border-green-700'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <TextField
                        cssStyle="ADMIN"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        disabled={status.isSubmitting}
                        label="Email Address"
                    />
                    <PasswordTextField
                        cssStyle="ADMIN"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your password"
                        disabled={status.isSubmitting}
                        label="Password"
                    />

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={status.isSubmitting}
                            className={`px-6 py-3 bg-[#7fffd4] text-[#0a1628] rounded-lg font-medium text-lg transition-all duration-200 ${status.isSubmitting
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-[#7fffd4] cursor-pointer'
                                }`}
                        >
                            {status.isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
} 