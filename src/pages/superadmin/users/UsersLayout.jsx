import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Search, Users, GraduationCap, BookOpen, Shield, Award, UserCheck } from 'lucide-react';

const UsersLayout = () => {
    const tabs = [
        { path: 'all', label: 'All Users', icon: Users },
        { path: 'students', label: 'Students', icon: GraduationCap },
        { path: 'teachers', label: 'Teachers', icon: BookOpen },
        { path: 'admins', label: 'Admins', icon: UserCheck },
        { path: 'hods', label: 'HODs', icon: Shield },
        { path: 'chairmen', label: 'Chairmen', icon: Award },
        { path: 'deans', label: 'Deans', icon: Shield },
    ];

    return (
        <Layout title="User Management" subtitle="View and manage all university personnel">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Tabs & Search */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">

                    {/* Scrollable Tabs */}
                    <div className="flex w-full lg:w-auto bg-gray-100/80 p-1 rounded-xl overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <NavLink
                                key={tab.path}
                                to={`/superadmin/users/${tab.path}`}
                                className={({ isActive }) =>
                                    `flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`
                                }
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-72 px-2 lg:px-0">
                        <Search className="absolute left-5 lg:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="w-full pl-11 lg:pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* Renders the specific user list based on the URL */}
                <Outlet />

            </div>
        </Layout>
    );
};

export default UsersLayout;