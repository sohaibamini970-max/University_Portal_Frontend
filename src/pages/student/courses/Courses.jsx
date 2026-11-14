import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { api } from '../../../context/AuthContext';
import { BookOpen, User, Award, ChevronRight, Loader2, GraduationCap } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/students/my-courses');
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Calculate Summary Dynamically
    const totalCourses = courses.length;
    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);

    // Grabbing the current semester/session from the first course (assuming they are all in the same batch)
    const currentSemester = courses.length > 0 ? courses[0].semester : 'N/A';
    const currentSession = courses.length > 0 ? courses[0].session : 'N/A';

    const summary = [
        { label: 'Total Courses', value: totalCourses.toString().padStart(2, '0'), gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
        { label: 'Total Credits', value: totalCredits.toString(), gradient: 'bg-gradient-to-br from-purple-500 to-pink-600' },
        { label: 'Current Semester', value: currentSemester, gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600' },
    ];

    if (loading) return <Layout title="My Courses"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="My Courses" subtitle={`${currentSession} · Semester ${currentSemester}`}>
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

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
                            <thead>
                                <tr className="bg-slate-800 text-slate-200 text-xs uppercase tracking-wider border-b border-slate-700">
                                    <th className="px-6 py-4 font-semibold">Code</th>
                                    <th className="px-6 py-4 font-semibold">Course Name</th>
                                    <th className="px-6 py-4 font-semibold text-center">Session</th>
                                    <th className="px-6 py-4 font-semibold text-center">Semester</th>
                                    <th className="px-6 py-4 font-semibold text-center">Section</th>
                                    <th className="px-6 py-4 font-semibold">Instructor</th>
                                    <th className="px-6 py-4 font-semibold text-center">Credits</th>
                                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {courses.length > 0 ? (
                                    courses.map((course, idx) => {
                                        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';

                                        return (
                                            <tr key={course.id} className={`${rowBg} hover:bg-indigo-50 transition-colors`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-8 rounded-full bg-indigo-500"></div>
                                                        <span className="text-sm font-bold text-gray-700">{course.code}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-800 text-sm">{course.name}</p>
                                                    <span className={`inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold rounded ${course.type === 'Core' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {course.type || 'Core'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-semibold text-gray-700">{course.session}</span>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">
                                                        {course.semester}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold px-2 py-1 rounded-md">
                                                        {course.section}
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
                                                        {course.creditHours}
                                                    </div>
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
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                            <p className="font-bold text-lg">No Courses Assigned</p>
                                            <p className="text-sm">You have not been enrolled in any courses for the current semester.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Courses;