import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { api } from '../../context/AuthContext';
import {
    BookOpen, Users, Layers, Search, Filter,
    ChevronRight, Loader2, GraduationCap, Award
} from 'lucide-react';

const TeacherCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('All');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/teachers/my-courses');
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Get unique semesters for the dropdown
    const semesters = ['All', ...new Set(courses.map(c => c.semester))];

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.batch.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;

        return matchesSearch && matchesSemester;
    });

    if (loading) return <Layout title="My Courses"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="My Courses" subtitle="View all the courses and sections assigned to you">
            <div className="space-y-6 max-w-7xl mx-auto pb-8">

                {/* Control Bar */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name, code, or batch..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Semester Filter */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <Filter className="w-4 h-4" /> Filter:
                        </div>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full md:w-48 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem === 'All' ? 'All Semesters' : sem}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Courses Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">

                                {/* Header */}
                                <div className="bg-slate-800 p-5 text-white relative overflow-hidden">
                                    <div className="absolute -right-4 -top-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                                <BookOpen className="w-5 h-5 text-indigo-200" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">{course.code}</span>
                                                <h3 className="font-bold text-lg leading-tight mt-0.5">{course.name}</h3>
                                            </div>
                                        </div>
                                        <span className="bg-white/20 px-2.5 py-1 rounded-md text-sm font-bold border border-white/10">
                                            Sec {course.section}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Semester</p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                                                {course.semester}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Credit Hours</p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-emerald-500" />
                                                {course.creditHours} Credits
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Batch / Program</p>
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                <GraduationCap className="w-4 h-4 text-purple-500" />
                                                {course.batch} <span className="text-gray-400 font-medium">({course.program})</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                                            View Course Details <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <BookOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Courses Found</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                            {searchQuery || selectedSemester !== 'All'
                                ? "Try adjusting your search or semester filter."
                                : "You currently do not have any courses assigned."}
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TeacherCourses;