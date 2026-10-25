import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Users, Award, Search, Plus } from 'lucide-react';

const StudentsLayout = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Layout title="Student Management" subtitle="Manage active students and review their academic records">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                {/* Search & Add */}
                <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
                        <div className="relative flex-1 lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                            <input
                                type="text"
                                placeholder="Search by name or roll no..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                </div>

                {/* Top Bar: Tabs & Add Button */}

                    {/* Tabs */}
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl">
                        <NavLink
                            to="/admin/students/active"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`
                            }
                        >
                            <Users className="w-4 h-4" /> Active Students
                        </NavLink>
                        <NavLink
                            to="/admin/students/records"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`
                            }
                        >
                            <Award className="w-4 h-4" /> Academic Records
                        </NavLink>
                    </div>

                </div>

                {/* Renders the specific tab content */}
                <Outlet context={{ searchQuery }} />

            </div>
        </Layout>
    );
};

export default StudentsLayout;