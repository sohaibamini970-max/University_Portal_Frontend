import React from 'react';
import { DollarSign, TrendingUp, AlertCircle, FileText } from 'lucide-react';

const FinanceDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">Total Collected</p>
                        <p className="text-3xl font-bold mt-1">45.5M PKR</p>
                        <p className="text-sm opacity-90 mt-1 font-medium">Fall 2025 Semester</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Pending Dues</p>
                    <p className="text-3xl font-bold mt-1 text-orange-600">8.2M PKR</p>
                    <p className="text-sm text-orange-600 mt-1 font-medium">From 150 students</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Scholarships Given</p>
                    <p className="text-3xl font-bold mt-1 text-emerald-600">2.1M PKR</p>
                    <p className="text-sm text-emerald-600 mt-1 font-medium">Adjustments applied</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;