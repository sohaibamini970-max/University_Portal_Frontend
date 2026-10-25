import React from 'react';
import Layout from '../../../components/Layout/Layout';
import { Map, CheckCircle, Clock, XCircle, Star, Zap, Award, TrendingUp, Calendar } from 'lucide-react';

const Roadmap = () => {
    // Core Courses Data
    const coreCourses = [
        { id: 1, code: 'CS-101', name: 'Intro to Programming', credits: 4, semester: '1st', status: 'Completed', grade: 'A' },
        { id: 2, code: 'CS-201', name: 'Discrete Mathematics', credits: 3, semester: '2nd', status: 'Completed', grade: 'B+' },
        { id: 3, code: 'CS-301', name: 'Data Structures', credits: 4, semester: '3rd', status: 'Completed', grade: 'A' },
        { id: 4, code: 'CS-302', name: 'Algorithms', credits: 4, semester: '4th', status: 'In Progress', grade: '-' },
        { id: 5, code: 'CS-401', name: 'Operating Systems', credits: 4, semester: '5th', status: 'Pending', grade: '-' },
        { id: 6, code: 'CS-402', name: 'Database Systems', credits: 3, semester: '5th', status: 'Pending', grade: '-' },
    ];

    // Elective Courses Data
    const electiveCourses = [
        { id: 7, code: 'CS-311', name: 'Web Development', credits: 3, semester: '3rd', status: 'Completed', grade: 'A-' },
        { id: 8, code: 'CS-312', name: 'Mobile App Dev', credits: 3, semester: '4th', status: 'In Progress', grade: '-' },
        { id: 9, code: 'CS-411', name: 'Machine Learning', credits: 3, semester: '6th', status: 'Pending', grade: '-' },
        { id: 10, code: 'CS-412', name: 'Cyber Security', credits: 3, semester: '7th', status: 'Pending', grade: '-' },
    ];

    // Semester GPA History Data
    const gpaHistory = [
        { id: 1, term: 'Fall 2024', semester: '1st', gpa: '3.85', cgpa: '3.85', credits: 15 },
        { id: 2, term: 'Spring 2025', semester: '2nd', gpa: '3.70', cgpa: '3.77', credits: 16 },
        { id: 3, term: 'Fall 2025', semester: '3rd', gpa: '3.90', cgpa: '3.81', credits: 18 },
        { id: 4, term: 'Spring 2026', semester: '4th', gpa: '3.80', cgpa: '3.81', credits: 17 },
        { id: 5, term: 'Fall 2026', semester: '5th', gpa: '-', cgpa: '-', credits: 18, isCurrent: true },
    ];

    // Helper for Status Styling
    const getStatusInfo = (status) => {
        switch (status) {
            case 'Completed':
                return { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, text: 'Completed' };
            case 'In Progress':
                return { color: 'bg-blue-100 text-blue-700', icon: Clock, text: 'In Progress' };
            case 'Pending':
                return { color: 'bg-gray-100 text-gray-600', icon: XCircle, text: 'Pending' };
            default:
                return { color: 'bg-gray-100 text-gray-600', icon: XCircle, text: 'Pending' };
        }
    };

    // Reusable Component to render the Table Container
    const CourseTable = ({ title, subtitle, courses, icon: Icon, iconColor }) => {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-gray-100 text-xs uppercase tracking-wider border-b border-slate-700">
                                <th className="px-6 py-4 font-semibold">Code</th>
                                <th className="px-6 py-4 font-semibold">Course Name</th>
                                <th className="px-6 py-4 font-semibold text-center">Credits</th>
                                <th className="px-6 py-4 font-semibold text-center">Semester</th>
                                <th className="px-6 py-4 font-semibold text-center">Grade</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {courses.map((course, idx) => {
                                const statusInfo = getStatusInfo(course.status);
                                const StatusIcon = statusInfo.icon;
                                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-200';

                                return (
                                    <tr key={course.id} className={`${rowBg} hover:bg-indigo-50 transition-colors`}>
                                        <td className="px-6 py-4 text-sm font-bold text-indigo-600">{course.code}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800 text-sm">{course.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-md">
                                                <Award className="w-3.5 h-3.5 text-gray-500" />
                                                {course.credits}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-600">{course.semester}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black ${course.grade === '-' ? 'bg-gray-100 text-gray-400' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {course.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${statusInfo.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" /> {statusInfo.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <Layout title="Academic Roadmap" subtitle="Your complete degree plan for BCS (2022-2026)">
            <div className="space-y-2 pb-8">

                {/* Core Courses Container */}
                <CourseTable
                    title="Core Courses"
                    subtitle="Mandatory subjects required for graduation."
                    courses={coreCourses}
                    icon={Zap}
                    iconColor="bg-blue-100 text-blue-600"
                />

                {/* Elective Courses Container */}
                <CourseTable
                    title="Elective Courses"
                    subtitle="Specialized subjects chosen based on your interests."
                    courses={electiveCourses}
                    icon={Star}
                    iconColor="bg-purple-100 text-purple-600"
                />

                {/* GPA & CGPA History Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Academic Performance</h2>
                            <p className="text-sm text-gray-500">Semester-wise GPA and cumulative CGPA history.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-blue-600 text-gray-100 text-xs uppercase tracking-wider border-b border-slate-700">
                                    <th className="px-6 py-4 font-semibold">Term / Event</th>
                                    <th className="px-6 py-4 font-semibold text-center">Semester</th>
                                    <th className="px-6 py-4 font-semibold text-center">Credits Taken</th>
                                    <th className="px-6 py-4 font-semibold text-center">Semester GPA</th>
                                    <th className="px-6 py-4 font-semibold text-center">Cumulative CGPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {gpaHistory.map((item, idx) => {
                                    const rowBg = item.isCurrent
                                        ? 'bg-indigo-50/60'
                                        : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-200');

                                    return (
                                        <tr key={item.id} className={`${rowBg} hover:bg-indigo-50 transition-colors`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-8 rounded-full ${item.isCurrent ? 'bg-indigo-500 animate-pulse' : 'bg-teal-500'}`}></div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                                            {item.term}
                                                            {item.isCurrent && (
                                                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase tracking-wider">Current</span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <Calendar className="w-3 h-3" /> Semester {item.semester}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                                                {item.semester}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center text-xs font-semibold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-md">
                                                    {item.credits}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.gpa !== '-' ? (
                                                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{item.gpa}</span>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.cgpa !== '-' ? (
                                                    <span className="text-sm font-black text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg">{item.cgpa}</span>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">Pending</span>
                                                )}
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

export default Roadmap;