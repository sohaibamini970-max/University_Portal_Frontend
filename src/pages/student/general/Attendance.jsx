import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { Eye, TrendingUp, AlertCircle, CheckCircle, Loader2, BookOpen } from 'lucide-react';
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

    if (loading) {
        return (
            <Layout title="Attendance">
                <div className="p-10 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Attendance Record" subtitle="Your overall attendance summary for the current semester">
            <div className="space-y-4 sm:space-y-6 pb-8 max-w-7xl mx-auto px-3 sm:px-0">

                {/* ================= SUMMARY CARDS ================= */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-5">
                    {/* Overall */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <div className="hidden sm:flex w-12 h-12 bg-white/20 rounded-xl items-center justify-center shrink-0">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-4 h-4 sm:hidden mb-0.5 opacity-90" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-sm font-medium text-blue-100 leading-tight">
                                    Overall
                                    <span className="hidden sm:inline"> Attendance</span>
                                </p>
                                <p className="text-lg sm:text-3xl font-bold leading-tight">{overallPercentage}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Attended */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <div className="hidden sm:flex w-12 h-12 bg-white/20 rounded-xl items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <CheckCircle className="w-4 h-4 sm:hidden mb-0.5 opacity-90" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-sm font-medium text-emerald-100 leading-tight">
                                    Attended
                                </p>
                                <p className="text-lg sm:text-3xl font-bold leading-tight">{attendedClasses}</p>
                            </div>
                        </div>
                    </div>

                    {/* Missed */}
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                            <div className="hidden sm:flex w-12 h-12 bg-white/20 rounded-xl items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <AlertCircle className="w-4 h-4 sm:hidden mb-0.5 opacity-90" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-sm font-medium text-orange-100 leading-tight">
                                    Missed
                                </p>
                                <p className="text-lg sm:text-3xl font-bold leading-tight">{totalClasses - attendedClasses}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= EMPTY STATE ================= */}
                {attendanceData.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
                        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-700">No attendance records yet</p>
                        <p className="text-xs text-gray-500 mt-1">Your subject-wise attendance will appear here.</p>
                    </div>
                ) : (
                    <>
                        {/* ============ < sm: CARD LIST ============ */}
                        <div className="sm:hidden space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-sm font-bold text-gray-800">Subject-wise Attendance</h2>
                                <span className="text-[11px] text-gray-500">
                                    {attendanceData.length} subject{attendanceData.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {attendanceData.map((item, idx) => {
                                const style = getStatusStyle(item.percentage);
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                                    >
                                        {/* Subject header */}
                                        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                                                        {item.courseName}
                                                    </p>
                                                    <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                                                        {item.courseCode}
                                                    </p>
                                                </div>
                                                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-md ${style.color}`}>
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-2 gap-2 px-4 py-3">
                                            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total</p>
                                                <p className="text-sm font-bold text-gray-800">{item.totalClasses}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Attended</p>
                                                <p className="text-sm font-bold text-gray-800">{item.attendedClasses}</p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="px-4 pb-3">
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${style.bar}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Link
                                            to={`/student/attendance-details?courseCode=${item.courseCode}`}
                                            className="flex items-center justify-center gap-1.5 w-full py-2.5 border-t border-gray-100 bg-blue-50/60 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Details
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ============ sm+: TABLE ============ */}
                        <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-800">Subject-wise Attendance</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[640px]">
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
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Attendance;