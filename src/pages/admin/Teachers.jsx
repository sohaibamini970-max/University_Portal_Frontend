import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import DataTable from '../../components/common/DataTable';
import {
    Plus, Search, BookOpen, X, CalendarCheck, Loader2
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const AdminTeachers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [attendanceTeacher, setAttendanceTeacher] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for viewing courses
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await api.get('/teachers/my-department');
                setTeachers(res.data);
            } catch (error) {
                console.error("Failed to fetch department teachers", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    // Fetch courses when a teacher is selected
    const handleViewCourses = async (teacher) => {
        setSelectedTeacher(teacher);
        setCoursesLoading(true);
        try {
            const res = await api.get(`/teacher-assignments/teacher/${teacher.id}`);
            setTeacherCourses(res.data);
        } catch (error) {
            console.error("Failed to load teacher courses", error);
            setTeacherCourses([]);
        } finally {
            setCoursesLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        (t.profile?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.profile?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'Teacher Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {(row.profile?.fullName || 'U').charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{row.profile?.fullName}</p>
                        <p className="text-xs text-gray-500">{row.designation}</p>
                    </div>
                </div>
            )
        },
        { key: 'employeeId', label: 'Employee ID' },
        { key: 'email', label: 'Email', render: (row) => row.profile?.email },
        {
            key: 'attendance',
            label: 'Attendance',
            render: (row) => (
                <button
                    onClick={() => setAttendanceTeacher(row)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors"
                >
                    <CalendarCheck className="w-3.5 h-3.5" /> N/A
                </button>
            )
        },
        {
            key: 'assignments',
            label: 'Courses',
            render: (row) => (
                <button
                    onClick={() => handleViewCourses(row)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                    <BookOpen className="w-3.5 h-3.5" /> View Courses
                </button>
            )
        },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.profile?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.profile?.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    if (isLoading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;

    return (
        <Layout title="Teachers" subtitle="Manage teachers, view courses, and track attendance">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80 p-2">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <DataTable columns={columns} data={filteredTeachers} itemsPerPage={10} />
            </div>

            {/* MODAL 1: VIEW COURSES */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh] md:h-[550px]">

                        {/* Left Sidebar: Teacher Info */}
                        <div className="w-full md:w-1/3 bg-slate-800 p-6 text-white flex flex-col shrink-0 relative">
                            <button onClick={() => setSelectedTeacher(null)} className="md:hidden absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full z-10">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="text-center mb-6 mt-4 md:mt-0">
                                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm mb-3">
                                    {(selectedTeacher.profile?.fullName || 'T').charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold">{selectedTeacher.profile?.fullName}</h2>
                                <p className="text-slate-300 text-sm">{selectedTeacher.profile?.email}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 shrink-0 mt-auto">
                                <div className="w-10 h-10 bg-indigo-500/30 text-indigo-200 rounded-lg flex items-center justify-center shrink-0">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Courses</p>
                                    <p className="text-xl font-bold leading-tight">{teacherCourses.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content: Real Courses List */}
                        <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
                            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Assigned Courses</h3>
                                <button onClick={() => setSelectedTeacher(null)} className="hidden md:block p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto bg-white flex-1">
                                {coursesLoading ? (
                                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                                ) : teacherCourses.length > 0 ? (
                                    <div className="space-y-3">
                                        {teacherCourses.map((course) => (
                                            <div key={course.id} className="border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between bg-gray-50">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{course.code}</span>
                                                        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">Sec {course.section}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-900">{course.name}</p>
                                                </div>
                                                <span className="text-sm font-bold text-gray-500">{course.semester} Sem</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                                        <p className="font-semibold text-gray-500">No courses assigned yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminTeachers;