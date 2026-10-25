import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { Megaphone, List } from 'lucide-react';

const AnnouncementsLayout = ({ rolePrefix }) => {
    const location = useLocation();

    // Base path e.g., "/superadmin/announcements"
    const basePath = `/${rolePrefix}/announcements`;

    return (
        <Layout title="Announcements" subtitle="Create and manage university announcements">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Tabs Container */}
                <div className="flex w-full sm:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
                    <NavLink
                        to={`${basePath}/add`}
                        className={({ isActive }) =>
                            `flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Megaphone className="w-4 h-4" /> Add Announcement
                    </NavLink>
                    <NavLink
                        to={`${basePath}/manage`}
                        className={({ isActive }) =>
                            `flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <List className="w-4 h-4" /> Manage Announcements
                    </NavLink>
                </div>

                {/* Renders the specific tab content */}
                <Outlet />

            </div>
        </Layout>
    );
};

export default AnnouncementsLayout;