import React from 'react';
import { Users, UserCheck, Clock, XCircle } from 'lucide-react';

const AdmissionsDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Applications</p>
                        <p className="text-3xl font-bold mt-1 text-gray-900">1,245</p>
                        <p className="text-sm text-blue-600 mt-1 font-medium">For Fall 2025</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Admitted Students</p>
                            <p className="text-3xl font-bold mt-1">850</p>
                            <p className="text-sm opacity-90 mt-1 font-medium">Enrolled successfully</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Review</p>
                        <p className="text-3xl font-bold mt-1 text-orange-600">395</p>
                        <p className="text-sm text-orange-600 mt-1 font-medium">Action required</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionsDashboard;