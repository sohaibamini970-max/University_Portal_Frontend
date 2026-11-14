import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Settings2, Database } from 'lucide-react';

const FirstSemesterLayout = () => {
    const location = useLocation();
    // If the path includes 'manage', the second tab is active
    const isManageTab = location.pathname.includes('manage');

    return (
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-max">
                    <NavLink
                        to="/systemadmin/registration/first-semester/create"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        <Settings2 className="w-4 h-4" /> Create Configuration
                    </NavLink>
                    <NavLink
                        to="/systemadmin/registration/first-semester/manage"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        <Database className="w-4 h-4" /> Manage Saved Configurations
                    </NavLink>
                </div>

                {/* Render the active page (Create or Manage) */}
                <Outlet />
            </div>

    );
};

export default FirstSemesterLayout;