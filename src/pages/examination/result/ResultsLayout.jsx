import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CheckCircle, Search } from 'lucide-react';

const ResultsLayout = () => {
    return (
        <div className="space-y-6">
            {/* Sub-tabs for Results */}
            <div className="flex w-full sm:w-auto bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-max">
                <NavLink
                    to="/examination/results/publish"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <CheckCircle className="w-4 h-4" /> Publish Results
                </NavLink>
                <NavLink
                    to="/examination/results/ledger"
                    className={({ isActive }) =>
                        `flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`
                    }
                >
                    <Search className="w-4 h-4" /> Student Result Ledger
                </NavLink>
            </div>

            <Outlet />
        </div>
    );
};

export default ResultsLayout;