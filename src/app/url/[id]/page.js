'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';

export default function Page({ params }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndRedirect = async () => {
            try {
                const apiUrl = `http://localhost:5000/get/`;
                const { id } = params;
                const res = await axios.post(apiUrl, { id });
                if (res.data && res.data.originalUrl) {
                    window.location.replace(res.data.originalUrl);
                } else {
                    setError('Original URL not found.');
                }
            } catch (err) {
                setError('Failed to retrieve the original URL.');
            } finally {
                setLoading(false);
            }
        };
        fetchAndRedirect();
    }, [params]);

    if (loading && !error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#18181b]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-16 h-16 border-4 border-[#6366f1] border-t-transparent rounded-full"
                />
                <span className="ml-4 text-white text-lg">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#18181b]">
                <Alert variant="destructive" className="mb-4 bg-[#23232a] text-white border border-[#6366f1] rounded-lg shadow-lg">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return null;
}