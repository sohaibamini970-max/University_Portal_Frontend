import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';

const CoursesLayout = () => {
    const { pathname } = useLocation();
    const base = pathname.startsWith('/systemadmin')
        ? '/systemadmin/courses'
        : '/superadmin/courses';

    const tabs = [
        { to: `${base}/create`, label: 'Create Course' },
        { to: `${base}/assign`, label: 'Assign Course' },
        { to: `${base}/manage`, label: 'Manage Courses' },
    ];

    return (
        <Layout title="Course Management" subtitle="Create courses, assign them to departments, and manage the catalog">

        <div className="space-y-4">
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-max">
                {tabs.map((t) => (
                    <NavLink
                        key={t.to}
                        to={t.to}
                        className={({ isActive }) =>
                            `px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        {t.label}
                    </NavLink>
                ))}
            </div>
            <Outlet />
        </div>
    </Layout>
    );
};

export default CoursesLayout;