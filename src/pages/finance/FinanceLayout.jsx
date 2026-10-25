import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { LayoutDashboard, DollarSign, Settings2 } from 'lucide-react';

const FinanceLayout = () => {
    return (
        <Layout title="Finance Department" subtitle="Manage student fees, payments, and fee structures">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Top Tabs */}
                <div className="flex w-full lg:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto w-max">
                    <NavLink
                        to="/finance/dashboard"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </NavLink>
                    <NavLink
                        to="/finance/fees"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <DollarSign className="w-4 h-4" /> Fee Management
                    </NavLink>
                    {/* 👇 New Tab */}
                    <NavLink
                        to="/finance/rates"
                        className={({ isActive }) =>
                            `flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Settings2 className="w-4 h-4" /> Fee Rates
                    </NavLink>
                </div>

                <Outlet />
            </div>
        </Layout>
    );
};

export default FinanceLayout;