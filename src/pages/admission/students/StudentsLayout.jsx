import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { UserPlus, List } from 'lucide-react';

const StudentsLayout = () => {
    return (
        <div className="space-y-6">
            {/* Sub-tabs for Students */}
            <div className="flex w-full sm:w-auto bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-max">
                <NavLink
                    to="/admissions/students/all"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <List className="w-4 h-4" /> Existing Students
                </NavLink>
                <NavLink
                    to="/admissions/students/add"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <UserPlus className="w-4 h-4" /> Add New Student
                </NavLink>
                
            </div>

            <Outlet />
        </div>
    );
};

export default StudentsLayout;