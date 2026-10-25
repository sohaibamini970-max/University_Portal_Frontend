import React from 'react';
import StatCard from '../../components/common/StatCard';
import { Building2, Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const SuperAdminDashboard = () => {
    const stats = [
        { icon: Building2, label: 'Total Departments', value: '12', change: 8, color: 'primary' },
        { icon: Users, label: 'Total Users', value: '2,543', change: 12, color: 'green' },
        { icon: GraduationCap, label: 'Students', value: '2,100', change: 5, color: 'orange' },
        { icon: BookOpen, label: 'Teachers', value: '443', change: 3, color: 'purple' },
    ];

    const departments = [
        { name: 'Computer Science', admin: 'Dr. Smith', students: 450, teachers: 25, status: 'Active' },
        { name: 'Electrical Engineering', admin: 'Dr. Johnson', students: 380, teachers: 20, status: 'Active' },
        { name: 'Business Administration', admin: 'Dr. Williams', students: 520, teachers: 30, status: 'Active' },
        { name: 'Mathematics', admin: 'Dr. Brown', students: 280, teachers: 18, status: 'Active' },
        { name: 'Physics', admin: 'Dr. Davis', students: 200, teachers: 15, status: 'Inactive' },
    ];

    return (
        <Layout title="Super Admin Dashboard" subtitle="Overview of entire university system">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Departments Overview */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Departments Overview</h2>
                    <button className="btn-primary text-sm">Manage Departments</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Department</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Admin</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Students</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Teachers</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr key={dept.name} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{dept.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{dept.admin}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{dept.students}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{dept.teachers}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === 'Active'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {dept.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default SuperAdminDashboard;