import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { UserCheck, Eye, TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../../context/AuthContext';

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await api.get('/attendance/my-attendance');
                setAttendanceData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const getStatusStyle = (pct) => {
        if (pct >= 90) return { color: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-600', bar: 'bg-emerald-500' };
        if (pct >= 80) return { color: 'bg-blue-100 text-blue-700', text: 'text-blue-600', bar: 'bg-blue-500' };
        if (pct >= 75) return { color: 'bg-orange-100 text-orange-700', text: 'text-orange-600', bar: 'bg-orange-500' };
        return { color: 'bg-red-100 text-red-700', text: 'text-red-600', bar: 'bg-red-500' };
    };

    const totalClasses = attendanceData.reduce((sum, item) => sum + item.totalClasses, 0);
    const attendedClasses = attendanceData.reduce((sum, item) => sum + item.attendedClasses, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    if (loading) return <Layout title="Attendance"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Attendance Record" subtitle="Your overall attendance summary for the current semester">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-blue-100">Overall Attendance</p>
                                <p className="text-3xl font-bold">{overallPercentage}%</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-emerald-100">Classes Attended</p>
                                <p className="text-3xl font-bold">{attendedClasses}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><AlertCircle className="w-6 h-6" /></div>
                            <div>
                                <p className="text-sm font-medium text-orange-100">Classes Missed</p>
                                <p className="text-3xl font-bold">{totalClasses - attendedClasses}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800">Subject-wise Attendance</h2>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-white text-xs uppercase tracking-wider">
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4 text-center">Total</th>
                                <th className="px-6 py-4 text-center">Attended</th>
                                <th className="px-6 py-4">Percentage</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendanceData.map((item, idx) => {
                                const style = getStatusStyle(item.percentage);
                                return (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{item.courseName}</p>
                                            <p className="text-xs text-indigo-600 font-semibold">{item.courseCode}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">{item.totalClasses}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{item.attendedClasses}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm font-bold ${style.text}`}>{item.percentage}%</span>
                                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full ${style.bar}`} style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/student/attendance-details?courseCode=${item.courseCode}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
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
        </Layout>
    );
};

export default Attendance;