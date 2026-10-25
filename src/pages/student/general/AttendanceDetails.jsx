import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { ArrowLeft, CheckCircle, XCircle, Calendar } from 'lucide-react';

const AttendanceDetails = () => {
    // Mock data for daily attendance (you can pass the subject code via URL params later)
    const dailyData = [
        { date: 'Oct 28, 2025', day: 'Monday', status: 'Present', time: '09:00 AM' },
        { date: 'Oct 26, 2025', day: 'Friday', status: 'Present', time: '09:00 AM' },
        { date: 'Oct 24, 2025', day: 'Wednesday', status: 'Absent', time: '09:00 AM' },
        { date: 'Oct 21, 2025', day: 'Monday', status: 'Present', time: '09:00 AM' },
        { date: 'Oct 17, 2025', day: 'Thursday', status: 'Present', time: '09:00 AM' },
        { date: 'Oct 14, 2025', day: 'Monday', status: 'Present', time: '09:00 AM' },
        { date: 'Oct 10, 2025', day: 'Thursday', status: 'Late', time: '09:15 AM' },
    ];

    return (
        <Layout title="Daily Attendance" subtitle="Data Structures (CS-301)">
            <div className="space-y-6 pb-8">
                {/* Back Button & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        to="/student/attendance"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Subjects
                    </Link>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Attended</p>
                            <p className="text-sm font-bold text-gray-800">38 / 40 Classes</p>
                        </div>
                    </div>
                </div>

                {/* List of days */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                        {dailyData.map((record, idx) => {
                            const isPresent = record.status === 'Present';
                            const isLate = record.status === 'Late';

                            return (
                                <div key={idx} className="relative pl-6">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm 
                                        ${isPresent ? 'bg-emerald-500' : isLate ? 'bg-orange-500' : 'bg-red-500'}`}>
                                        {isPresent ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Record Card */}
                                    <div className={`p-4 rounded-xl border ${isPresent ? 'border-emerald-100 bg-emerald-50/50' : isLate ? 'border-orange-100 bg-orange-50/50' : 'border-red-100 bg-red-50/50'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                                        <div>
                                            <p className="font-bold text-gray-800">{record.date}</p>
                                            <p className="text-xs font-medium text-gray-500">{record.day}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                                                {record.time}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full 
                                                ${isPresent ? 'bg-emerald-100 text-emerald-700' : isLate ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AttendanceDetails;