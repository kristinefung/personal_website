"use client";
import React, { useState, useEffect } from "react";
import { journeyApi } from '@/lib/api/journeyApi';
import { JourneyResponse } from '@/types/api';

export default function Journey() {
    const [journeys, setJourneys] = useState<JourneyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJourneys = async () => {
            try {
                setLoading(true);
                const journeyData = await journeyApi.getAllJourneys();
                setJourneys(journeyData);
                setError(null);
            } catch (err) {
                console.error('Error fetching journeys:', err);
                setError(err instanceof Error ? err.message : 'Failed to load journeys');
            } finally {
                setLoading(false);
            }
        };

        fetchJourneys();
    }, []);

    // Helper function to format year range
    const formatYearRange = (startYear: number, endYear: number | null, isCurrent: boolean) => {
        if (isCurrent) {
            return `${startYear} - Present`;
        }
        return endYear ? `${startYear} - ${endYear}` : `${startYear}`;
    };

    if (loading) {
        return (
            <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Journey</h2>
                <div className="h-1 w-32 bg-[#7fffd4] mb-10" />
                <div className="relative ml-4">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="relative flex items-start mb-6">
                            <div className="absolute left-2 top-6 bottom-0 w-1 bg-gray-700 transform -translate-x-1/2" />
                            <div className="relative z-10 mr-6">
                                <span className="w-4 h-4 bg-gray-700 rounded-full block mt-2 animate-pulse" />
                            </div>
                            <div className="mb-6 animate-pulse">
                                <div className="h-6 bg-gray-700 rounded mb-2 w-32"></div>
                                <div className="h-8 bg-gray-700 rounded mb-2 w-64"></div>
                                <div className="h-6 bg-gray-700 rounded mb-2 w-48"></div>
                                <div className="h-4 bg-gray-700 rounded w-96"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Journey</h2>
                <div className="h-1 w-32 bg-[#7fffd4] mb-10" />
                <p className="text-red-400 text-lg">
                    {error}
                </p>
            </section>
        );
    }

    if (journeys.length === 0) {
        return (
            <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full">
                <h2 className="text-4xl font-bold text-white mb-2">My Journey</h2>
                <div className="h-1 w-32 bg-[#7fffd4] mb-10" />
                <p className="text-gray-400 text-lg">
                    No journey entries available at the moment.
                </p>
            </section>
        );
    }

    return (
        <section className="py-24 px-8 md:px-16 bg-[#0a1628] w-full">
            <h2 className="text-4xl font-bold text-white mb-2">My Journey</h2>
            <div className="h-1 w-32 bg-[#7fffd4] mb-10" />
            <div className="relative ml-4">
                {journeys.map((journey, idx) => (
                    <div key={journey.id} className="relative flex items-start mb-6">
                        {/* Timeline Line */}
                        <div className="absolute left-2 top-6 bottom-0 w-1 bg-[#7fffd4] transform -translate-x-1/2" />

                        {/* Timeline Dot */}
                        <div className="relative z-10 mr-6">
                            <span
                                className={`w-4 h-4 rounded-full block mt-2 bg-[#7fffd4]`}
                            />
                        </div>
                        {/* Content */}
                        <div className="mb-6">
                            <div className="text-[#7fffd4] text-xl font-mono mb-2">
                                {formatYearRange(journey.startYear, journey.endYear, journey.isCurrent)}
                            </div>
                            <div className="text-2xl md:text-2xl font-bold text-white mb-2">
                                {journey.title}
                            </div>
                            <div className="text-[#7fffd4] font-bold text-lg mb-2">
                                {journey.institution}
                            </div>
                            <div className="text-gray-400 text-base max-w-3xl whitespace-pre-line">
                                {journey.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 