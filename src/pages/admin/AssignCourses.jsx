import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Search, BookOpen, Layers, X, CheckCircle, ChevronRight, Loader2, Trash2
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const AssignCourses = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('All');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [successSection, setSuccessSection] = useState(null);

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/teacher-assignments/my-department');
            setCourses(res.data);
            if (selectedCourse) {
                // Refresh the currently open modal with new data
                const updated = res.data.find(c => c.id === selectedCourse.id);
                setSelectedCourse(updated);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, teachersRes] = await Promise.all([
                    api.get('/teacher-assignments/my-department'),
                    api.get('/teachers')
                ]);
                setCourses(coursesRes.data);
                setTeachers(teachersRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSemester = selectedSemester === 'All' || course.semester === selectedSemester;
        return matchesSearch && matchesSemester;
    });

    // 👇 ASSIGN / UPDATE TEACHER 👇
    const handleAssignInline = async (courseId, sectionName, teacherId) => {
        if (!teacherId) return;
        try {
            await api.post('/teacher-assignments', {
                teacherId: teacherId,
                programCourseId: courseId,
                sectionName: sectionName
            });

            setSuccessSection(`${courseId}-${sectionName}`);
            setTimeout(() => setSuccessSection(null), 1500);

            // Refresh data
            fetchCourses();
        } catch (error) {
            alert("Failed to assign teacher");
        }
    };

    // 👇 UNASSIGN / DELETE TEACHER 👇
    const handleUnassign = async (assignmentId) => {
        if (!window.confirm("Are you sure you want to unassign this teacher?")) return;
        try {
            await api.delete(`/teacher-assignments/${assignmentId}`);
            fetchCourses();
        } catch (error) {
            alert("Failed to unassign teacher");
        }
    };

    if (loading) return <Layout title="Course Assignments"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div></Layout>;

    return (
        <Layout title="Course Assignments" subtitle="Manage teacher assignments for specific course sections">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Control Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="relative w-full md:w-96 p-2">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto p-2 md:p-0">
                        <label className="text-sm font-bold text-gray-700 whitespace-nowrap flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-400" /> Filter Semester:
                        </label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full md:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                        >
                            <option value="All">All Semesters</option>
                            {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                                <option key={sem} value={sem}>{sem} Semester</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    {filteredCourses.map((course) => {
                        const assignedCount = course.assignments.length;
                        const totalSections = course.sections.length;
                        const isFullyAssigned = assignedCount === totalSections;

                        return (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course)}
                                className="group cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between p-5 gap-4"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isFullyAssigned ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{course.code}</span>
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Sem {course.semester}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                                    </div>
                                </div>

                                <div className="flex-1 w-full md:w-auto">
                                    <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-bold mb-2">
                                        <span className="text-gray-500 md:hidden">Sections:</span>
                                        <span className={isFullyAssigned ? 'text-emerald-600' : 'text-orange-500'}>
                                            {assignedCount} / {totalSections} Assigned
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap md:justify-end gap-2">
                                        {course.sections.map(secName => {
                                            const isAssigned = course.assignments.some(a => a.sectionName === secName);
                                            return (
                                                <div key={secName} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isAssigned ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-orange-50 border-orange-200 text-orange-600 border-dashed'}`}>
                                                    Sec {secName}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="hidden md:flex shrink-0 text-gray-400 group-hover:text-emerald-600 transition-colors pl-4 border-l border-gray-100">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white relative shrink-0">
                            <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                            <p className="text-emerald-100 font-medium">{selectedCourse.code} • Semester {selectedCourse.semester}</p>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50">
                            {selectedCourse.sections.map((secName) => {
                                const assignment = selectedCourse.assignments.find(a => a.sectionName === secName);
                                const isSuccess = successSection === `${selectedCourse.id}-${secName}`;

                                return (
                                    <div key={secName} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg border border-emerald-100">{secName}</div>
                                            <p className="font-bold text-gray-900">Section {secName}</p>
                                        </div>

                                        <div className="flex-1 sm:max-w-xs w-full flex items-center gap-2">
                                            {isSuccess ? (
                                                <div className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-lg border border-emerald-200">
                                                    <CheckCircle className="w-4 h-4" /> Saved!
                                                </div>
                                            ) : (
                                                <>
                                                    <select
                                                        value={assignment?.teacherId || ''}
                                                        onChange={(e) => handleAssignInline(selectedCourse.id, secName, e.target.value)}
                                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm font-semibold outline-none cursor-pointer ${assignment ? 'bg-white border-gray-300 text-gray-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}
                                                    >
                                                        <option value="" disabled>-- Assign Teacher --</option>
                                                        {teachers.map(t => (
                                                            <option key={t.id} value={t.id}>{t.profile?.fullName} ({t.designation})</option>
                                                        ))}
                                                    </select>

                                                    {/* 👇 UNASSIGN BUTTON 👇 */}
                                                    {assignment && (
                                                        <button
                                                            onClick={() => handleUnassign(assignment.id)}
                                                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0"
                                                            title="Unassign Teacher"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0 text-right">
                            <button onClick={() => setSelectedCourse(null)} className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl">Done</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AssignCourses;