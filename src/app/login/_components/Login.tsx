"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "@/store";
import { LoginRequest } from "@/types/auth";
import { loginFormSchema } from "@/lib/validation/schemas";
import TextField from "@/component/form/TextField";
import PasswordTextField from "@/component/form/PasswordTextField";

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginStatus {
    isSubmitting: boolean;
    message: string;
    isError: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function Login() {
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [status, setStatus] = useState<LoginStatus>({
        isSubmitting: false,
        message: '',
        isError: false
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        const validationResult = loginFormSchema.safeParse(formData);

        if (!validationResult.success) {
            const newErrors: FormErrors = {};
            validationResult.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FormErrors;
                if (fieldName) {
                    newErrors[fieldName] = issue.message;
                }
            });
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
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
            };

            await login(loginData);

            setStatus({
                isSubmitting: false,
                message: 'Login successful! Redirecting...',
                isError: false
            });

            // Reset form
            setFormData({
                email: '',
                password: '',
            });

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);

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
                    {(status.message || error) && (
                        <div className={`p-4 rounded-lg text-center ${(status.isError || error)
                            ? 'bg-red-900/50 text-red-200 border border-red-700'
                            : 'bg-green-900/50 text-green-200 border border-green-700'
                            }`}>
                            {status.message || error}
                        </div>
                    )}

                    <TextField
                        cssStyle="CUSTOMER"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        disabled={isLoading}
                        label="Email Address"
                        error={errors.email}
                    />
                    <PasswordTextField
                        cssStyle="CUSTOMER"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your password"
                        disabled={isLoading}
                        label="Password"
                        error={errors.password}
                    />

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 bg-[#7fffd4] text-[#0a1628] rounded-lg font-medium text-lg transition-all duration-200 ${isLoading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-[#7fffd4] cursor-pointer'
                                }`}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

            </div>
        </section>
    );
} 