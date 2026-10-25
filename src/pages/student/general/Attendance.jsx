import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { UserCheck, Eye, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const Attendance = () => {
    const attendanceData = [
        { code: 'CS-301', name: 'Data Structures', total: 40, attended: 38, percentage: 95, status: 'Excellent' },
        { code: 'CS-302', name: 'Web Development', total: 35, attended: 30, percentage: 85, status: 'Good' },
        { code: 'CS-303', name: 'Algorithms', total: 42, attended: 39, percentage: 92, status: 'Excellent' },
        { code: 'CS-304', name: 'Databases', total: 30, attended: 21, percentage: 70, status: 'Warning' },
        { code: 'CS-305', name: 'Operating Systems', total: 38, attended: 35, percentage: 92, status: 'Excellent' },
    ];

    // Helper for styling based on percentage
    const getStatusStyle = (pct) => {
        if (pct >= 90) return { color: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-600', bar: 'bg-emerald-500' };
        if (pct >= 80) return { color: 'bg-blue-100 text-blue-700', text: 'text-blue-600', bar: 'bg-blue-500' };
        if (pct >= 75) return { color: 'bg-orange-100 text-orange-700', text: 'text-orange-600', bar: 'bg-orange-500' };
        return { color: 'bg-red-100 text-red-700', text: 'text-red-600', bar: 'bg-red-500' };
    };

    return (
        <Layout title="Attendance Record" subtitle="Your overall attendance summary for the current semester">
            <div className="space-y-6 pb-8">

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-blue-100">Overall Attendance</p>
                                <p className="text-3xl font-bold">87%</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-emerald-100">Classes Attended</p>
                                <p className="text-3xl font-bold">163</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><AlertCircle className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-orange-100">Classes Missed</p>
                                <p className="text-3xl font-bold">23</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Subject-wise Attendance</h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-600 text-gray-100 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-semibold">Subject</th>
                                    <th className="px-6 py-4 font-semibold">Code</th>
                                    <th className="px-6 py-4 font-semibold text-center">Total Classes</th>
                                    <th className="px-6 py-4 font-semibold text-center">Attended</th>
                                    <th className="px-6 py-4 font-semibold">Percentage</th>
                                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {attendanceData.map((subject, idx) => {
                                    const style = getStatusStyle(subject.percentage);

                                    // 👇 This creates the alternating colors 👇
                                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-200';

                                    return (
                                        // Apply the dynamic background class here
                                        <tr key={idx} className={`${rowBg} transition-colors`}>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{subject.name}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-indigo-600">{subject.code}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{subject.total}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">{subject.attended}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-bold ${style.text}`}>{subject.percentage}%</span>
                                                    {/* Changed background of progress bar to gray-200 so it shows on white rows */}
                                                    <div className="w-full max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${subject.percentage}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    to="/student/attendance-details"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                    title="View Daily Attendance"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Attendance;