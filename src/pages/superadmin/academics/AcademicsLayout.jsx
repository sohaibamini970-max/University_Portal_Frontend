import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { BookOpen, Calendar, CalendarDays, Layers } from 'lucide-react';

const AcademicsLayout = () => {
    const tabs = [
        { path: 'programs', label: 'Programs', icon: BookOpen },
        { path: 'batches', label: 'Batches', icon: Layers },
        { path: 'calendar', label: 'Calendar', icon: CalendarDays },
    ];

    return (
        <Layout title="Academic Management" subtitle="Manage the complete academic hierarchy">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex w-full lg:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto w-max">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) =>
                                `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* This is where child pages render */}
                <Outlet />
            </div>
        </Layout>
    );
};

export default AcademicsLayout;