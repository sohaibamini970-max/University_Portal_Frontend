import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';

const AdmissionsLayout = () => {
    return (
        <Layout title="Admissions Department" subtitle="Manage students, teachers, and admissions">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Top Tabs */}
                <div className="flex w-full lg:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto w-max">
                    <NavLink
                        to="/admissions/dashboard"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/admissions/students"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Users className="w-4 h-4" /> Students
                    </NavLink>

                    {/* 👇 NEW TEACHERS TAB 👇 */}
                    <NavLink
                        to="/admissions/teachers"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <BookOpen className="w-4 h-4" /> Teachers
                    </NavLink>
                </div>

                <Outlet />
            </div>
        </Layout>
    );
};

export default AdmissionsLayout;