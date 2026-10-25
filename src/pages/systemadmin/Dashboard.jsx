import React from 'react';
import { Users, GraduationCap, BookOpen, Shield } from 'lucide-react';

const SystemAdminDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold mt-1 text-gray-900">2,450</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">Total Teachers</p>
                        <p className="text-3xl font-bold mt-1">185</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">System Admins</p>
                    <p className="text-3xl font-bold mt-1 text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default SystemAdminDashboard;