"use client";
import React, { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { enquiryApi } from "@/lib/api/enquiryApi";
import { CreateEnquiryRequest } from "@/types/api";

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormStatus {
    isSubmitting: boolean;
    message: string;
    isError: boolean;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState<FormStatus>({
        isSubmitting: false,
        message: '',
        isError: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
            setStatus({
                isSubmitting: false,
                message: 'Please fill in all required fields (Name, Subject, and Message)',
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
            const enquiryData: CreateEnquiryRequest = {
                name: formData.name.trim(),
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            };

            await enquiryApi.createEnquiry(enquiryData);

            setStatus({
                isSubmitting: false,
                message: 'Thank you for your message! I\'ll get back to you soon.',
                isError: false
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setStatus({
                isSubmitting: false,
                message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
                isError: true
            });
        }
    };

    return (
        <section className="py-24 px-8 md:px-16 bg-[#112240] w-full flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-2">Get In Touch</h2>
            <p className="text-gray-400 mb-8 text-center max-w-2xl">
                Whether you have a question or just want to say hi, I'll do my best to get back to you!
            </p>
            <form onSubmit={handleSubmit} autoComplete="off" noValidate className="bg-[#0a1628] rounded-lg p-8 w-full max-w-2xl flex flex-col gap-6 shadow-lg">
                {status.message && (
                    <div className={`p-4 rounded-lg text-center ${status.isError
                        ? 'bg-red-900/50 text-red-200 border border-red-700'
                        : 'bg-green-900/50 text-green-200 border border-green-700'
                        }`}>
                        {status.message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input
                            className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={status.isSubmitting}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="phone">Phone</label>
                        <input
                            className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]"
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={status.isSubmitting}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-gray-300 mb-2" htmlFor="name">Name *</label>
                        <input
                            className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={status.isSubmitting}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="subject">Subject *</label>
                    <input
                        className="w-full p-2 rounded bg-[#1e3557] text-white focus:outline-none focus:ring-2 focus:ring-[#7fffd4]"
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        disabled={status.isSubmitting}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2" htmlFor="message">Message *</label>
                    <textarea
                        className="w-full p-2 rounded bg-[#1e3557] text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#7fffd4]"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={status.isSubmitting}
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        disabled={status.isSubmitting}
                        className={`px-8 py-3 border border-[#7fffd4] text-[#7fffd4] rounded hover:bg-[#7fffd4] hover:text-[#0a1628] transition-colors font-semibold ${status.isSubmitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                            }`}
                    >
                        {status.isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
            <div className="mt-10 flex flex-col items-center">
                <p className="text-gray-400 mb-4 text-lg">Or reach out directly:</p>
                <div className="flex gap-8">
                    <a href="#" aria-label="Email" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaEnvelope /></a>
                    <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaGithub /></a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-[#7fffd4] text-3xl transition-colors"><FaLinkedin /></a>
                </div>
            </div>
        </section>
    );
} 