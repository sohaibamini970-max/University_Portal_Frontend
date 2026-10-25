import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, ArrowRight } from 'lucide-react';

const AnnouncementPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if the popup has been shown in this session
        const hasSeenPopup = sessionStorage.getItem('hasSeenAnnouncementPopup');

        if (!hasSeenPopup) {
            // Small delay so it doesn't flash instantly on login
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Remember that they saw it for this session
        sessionStorage.setItem('hasSeenAnnouncementPopup', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Card */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">

                {/* Header gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
                    <div className="absolute top-4 right-4">
                        <button onClick={handleClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Bell className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">New Announcements!</h2>
                    <p className="text-indigo-100 text-sm mt-1">You have 2 unread notices</p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Mid-Term Exam Schedule</h4>
                                <p className="text-xs text-gray-500 mt-1">The examination schedule for Fall 2024 is now available.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Spring 2025 Fee Voucher</h4>
                                <p className="text-xs text-gray-500 mt-1">Download your fee challan before Nov 15 to avoid fines.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link
                            to="/student/announcements"
                            onClick={handleClose}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            View All Announcements <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={handleClose}
                            className="w-full py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPopup;