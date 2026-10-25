import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { PlusCircle, Layers, List } from 'lucide-react';

const CoursesLayout = () => {
    return (
        <Layout title="Course Management" subtitle="Create courses, assign them to departments, and manage the catalog">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Tabs */}
                <div className="flex w-full lg:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto w-max">
                    <NavLink
                        to="/superadmin/courses/create"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <PlusCircle className="w-4 h-4" /> Create Course
                    </NavLink>
                    <NavLink
                        to="/superadmin/courses/assign"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Layers className="w-4 h-4" /> Assign Departments
                    </NavLink>
                    <NavLink
                        to="/superadmin/courses/manage"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <List className="w-4 h-4" /> Manage Courses
                    </NavLink>
                </div>

                <Outlet />
            </div>
        </Layout>
    );
};

export default CoursesLayout;