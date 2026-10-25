import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { BookOpen, User, Award, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';

const Courses = () => {
    // Added session and semester to the data
    const courses = [
        { id: 1, code: 'CS-301', name: 'Data Structures', teacher: 'John Doe', credits: 4, grade: 'A', progress: 100, color: 'bg-blue-500', type: 'Core', session: '2024 Fall', semester: '5th' },
        { id: 2, code: 'CS-302', name: 'Web Development', teacher: 'Sarah Wilson', credits: 3, grade: 'B+', progress: 60, color: 'bg-purple-500', type: 'Core', session: '2024 Spring', semester: '5th' },
        { id: 3, code: 'CS-303', name: 'Algorithms', teacher: 'Mike Chen', credits: 4, grade: 'A-', progress: 85, color: 'bg-teal-500', type: 'Core', session: '2024 Spring', semester: '5th' },
        { id: 4, code: 'CS-304', name: 'Databases', teacher: 'Lisa Brown', credits: 3, grade: 'F', progress: 45, color: 'bg-red-500', type: 'Core', session: '2024 Spring', semester: '4th' },
        { id: 5, code: 'CS-305', name: 'Operating Systems', teacher: 'David Lee', credits: 4, grade: 'A', progress: 100, color: 'bg-pink-500', type: 'Core', session: '2024 Fall', semester: '4th' },
        { id: 6, code: 'CS-306', name: 'Computer Networks', teacher: 'Emma Wilson', credits: 3, grade: 'B+', progress: 30, color: 'bg-indigo-500', type: 'Elective', session: '2024 Fall', semester: '4th' },
    ];

    const summary = [
        { label: 'Total Courses', value: '06', gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
        { label: 'Total Credits', value: '21', gradient: 'bg-gradient-to-br from-purple-500 to-pink-600' },
        { label: 'Average Grade', value: 'A-', gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600' },
    ];

    // Helper to render dynamic status badges
    const getStatusBadge = (progress, grade) => {
        if (grade === 'F') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">
                    <XCircle className="w-3.5 h-3.5" /> Failed
                </span>
            );
        }
        if (progress >= 100) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" /> Passed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
                <Clock className="w-3.5 h-3.5" /> In Progress
            </span>
        );
    };

    return (
        <Layout title="My Courses" subtitle="Fall 2024 · Semester 5 · Section C">
            <div className="space-y-6 pb-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {summary.map((s) => (
                        <div key={s.label} className={`${s.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="relative z-10">
                                <p className="text-sm font-medium opacity-90">{s.label}</p>
                                <p className="text-3xl font-bold mt-1">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Course Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Enrolled Courses</h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">

                            {/* Table Header */}
                            <thead>
                                <tr className="bg-blue-600 text-gray-100 text-xs uppercase tracking-wider border-b border-slate-700">
                                    <th className="px-6 py-4 font-semibold">Code</th>
                                    <th className="px-6 py-4 font-semibold">Course Name</th>
                                    <th className="px-6 py-4 font-semibold text-center">Session</th>
                                    <th className="px-6 py-4 font-semibold text-center">Semester</th>
                                    <th className="px-6 py-4 font-semibold">Instructor</th>
                                    <th className="px-6 py-4 font-semibold text-center">Credit Hour</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>

                            {/* Table Body with Alternating Rows */}
                            <tbody className="divide-y divide-gray-100">
                                {courses.map((course, idx) => {
                                    // Alternating row colors
                                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';

                                    return (
                                        <tr key={course.id} className={`${rowBg} hover:bg-indigo-50 transition-colors`}>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-8 rounded-full ${course.color}`}></div>
                                                    <span className="text-sm font-bold text-gray-700">{course.code}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800 text-sm">{course.name}</p>
                                                <span className={`inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded ${course.type === 'Core' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {course.type}
                                                </span>
                                            </td>

                                            {/* New Session Column */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-semibold text-gray-700">{course.session}</span>
                                            </td>

                                            {/* New Semester Column */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">
                                                    {course.semester}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    {course.teacher}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center gap-1 text-sm font-medium text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-md">
                                                    <Award className="w-4 h-4 text-gray-400" />
                                                    {course.credits}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(course.progress, course.grade)}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    to="/student/course-info"
                                                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                                                >
                                                    Details <ChevronRight className="w-3.5 h-3.5" />
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

export default Courses;