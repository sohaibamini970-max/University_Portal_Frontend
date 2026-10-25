import React from 'react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/common/StatCard';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { icon: GraduationCap, label: 'Total Students', value: '450', change: 5, color: 'orange' },
        { icon: BookOpen, label: 'Total Teachers', value: '25', change: 2, color: 'green' },
        { icon: Users, label: 'Active Courses', value: '38', change: 8, color: 'primary' },
        { icon: Calendar, label: 'Ongoing Classes', value: '12', change: 0, color: 'purple' },
    ];

    const recentTeachers = [
        { name: 'John Doe', subject: 'Data Structures', email: 'john@uni.edu' },
        { name: 'Sarah Wilson', subject: 'Web Development', email: 'sarah@uni.edu' },
        { name: 'Mike Chen', subject: 'Algorithms', email: 'mike@uni.edu' },
    ];

    const recentStudents = [
        { name: 'Emma Davis', semester: '5th', roll: 'CS-2021-045' },
        { name: 'James Miller', semester: '3rd', roll: 'CS-2022-112' },
        { name: 'Olivia Taylor', semester: '7th', roll: 'CS-2020-089' },
    ];

    return (
        <Layout title="Department Dashboard" subtitle="Computer Science Department - Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Teachers */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Teachers</h2>
                        <a href="/admin/teachers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentTeachers.map((t) => (
                            <div key={t.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-primary-700 font-semibold text-sm">{t.name[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm">{t.name}</p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {t.subject} • {t.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Students */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
                        <a href="/admin/students" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentStudents.map((s) => (
                            <div key={s.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-orange-700 font-semibold text-sm">{s.name[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                                    <p className="text-xs text-gray-500 truncate">
                                        Semester {s.semester} • {s.roll}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;