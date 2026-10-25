import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { GraduationCap, Briefcase, Plus, Search } from 'lucide-react';

const DepartmentsLayout = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Layout title="Departments" subtitle="Manage university academic and administrative departments">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Top Bar: Tabs & Add Button */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">

                    {/* Tabs */}
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl">
                        <NavLink
                            to="/superadmin/departments/education"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`
                            }
                        >
                            <GraduationCap className="w-4 h-4" /> Educational
                        </NavLink>
                        <NavLink
                            to="/superadmin/departments/business"
                            className={({ isActive }) =>
                                `flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`
                            }
                        >
                            <Briefcase className="w-4 h-4" /> Business / Admin
                        </NavLink>
                    </div>

                    {/* Search & Add */}
                    <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search departments..."
                                // In a real app, pass this via Context or URL params if the children need it
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* This is where the specific department type renders */}
                <Outlet />

            </div>
        </Layout>
    );
};

export default DepartmentsLayout;