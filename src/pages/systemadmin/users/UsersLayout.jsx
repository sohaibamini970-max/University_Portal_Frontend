import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { GraduationCap, BookOpen, Shield } from 'lucide-react';

const UsersLayout = () => {
    return (
        <div className="space-y-6">
            {/* Sub-tabs for User Types */}
            <div className="flex w-full sm:w-auto bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-max">
                <NavLink
                    to="/systemadmin/users/students"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <GraduationCap className="w-4 h-4" /> Students
                </NavLink>
                <NavLink
                    to="/systemadmin/users/teachers"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <BookOpen className="w-4 h-4" /> Teachers
                </NavLink>
                <NavLink
                    to="/systemadmin/users/admins"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <Shield className="w-4 h-4" /> Admins
                </NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default UsersLayout;