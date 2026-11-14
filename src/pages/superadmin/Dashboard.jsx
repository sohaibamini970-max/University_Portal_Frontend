import React, { useState, useEffect } from 'react';
import { Building2, Users, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { api } from '../../context/AuthContext'; // 👈 Import API
import Layout from '../../components/Layout/Layout';

const SuperAdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/auth/dashboard-stats');
                setData(res.data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;

    // Define the vibrant cards
    const stats = [
        {
            icon: Building2,
            label: 'Total Departments',
            value: data?.stats.departments || 0,
            gradient: 'from-blue-500 to-indigo-600',
            bgIcon: 'bg-blue-400/20'
        },
        {
            icon: Users,
            label: 'Total Users',
            value: data?.stats.users || 0,
            gradient: 'from-emerald-500 to-teal-600',
            bgIcon: 'bg-emerald-400/20'
        },
        {
            icon: GraduationCap,
            label: 'Students',
            value: data?.stats.students || 0,
            gradient: 'from-orange-500 to-red-500',
            bgIcon: 'bg-orange-400/20'
        },
        {
            icon: BookOpen,
            label: 'Teachers',
            value: data?.stats.teachers || 0,
            gradient: 'from-purple-500 to-pink-600',
            bgIcon: 'bg-purple-400/20'
        },
    ];

    return (
        <Layout title="Super Admin Dashboard" subtitle="Overview of entire university system">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group`}
                        >
                            {/* Decorative Background Circle */}
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bgIcon} group-hover:scale-110 transition-transform duration-300`}></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80">{stat.label}</p>
                                    <p className="text-4xl font-black mt-1">{stat.value.toLocaleString()}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${stat.bgIcon} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Departments Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Departments Overview</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all university departments.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
                        Manage Departments
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-indigo-600" >
                            <tr className="bg-indigo-600 text-white text-sm font-bold uppercase tracking-wider border-b border-gray-200">
                                <th className="py-4 px-6 text-sm">Department</th>
                                <th className="py-4 px-6 text-sm">Admin</th>
                                <th className="py-4 px-6 text-sm">Students</th>
                                <th className="py-4 px-6 text-sm">Teachers</th>
                                <th className="py-4 px-6 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.departmentsList.length > 0 ? (
                                data.departmentsList.map((dept, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-bold text-gray-900">{dept.name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{dept.adminName}</td>
                                        <td className="py-4 px-6 text-sm font-semibold text-indigo-600">{dept.studentCount}</td>
                                        <td className="py-4 px-6 text-sm font-semibold text-indigo-600">{dept.teacherCount}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${dept.status === 'Active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {dept.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        No departments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default SuperAdminDashboard;