import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import DataTable from '../../components/common/DataTable';
import {
    Plus, Search, BookOpen, X, GraduationCap, Layers,
    CalendarCheck, CheckCircle, Clock, XCircle
} from 'lucide-react';

const AdminTeachers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [attendanceTeacher, setAttendanceTeacher] = useState(null);

    // Mock Data
    const [teachers] = useState([
        {
            id: 1, name: 'John Doe', email: 'john@uni.edu', phone: '+1 555-0101', status: 'Active',
            attendance: 95,
            attendanceLogs: [
                { date: 'Oct 28, 2025', day: 'Monday', status: 'Present', timeIn: '08:25 AM' },
                { date: 'Oct 27, 2025', day: 'Friday', status: 'Present', timeIn: '08:30 AM' },
                { date: 'Oct 26, 2025', day: 'Thursday', status: 'Late', timeIn: '08:45 AM' },
                { date: 'Oct 25, 2025', day: 'Wednesday', status: 'Present', timeIn: '08:20 AM' },
                { date: 'Oct 24, 2025', day: 'Tuesday', status: 'Present', timeIn: '08:15 AM' },
                { date: 'Oct 23, 2025', day: 'Monday', status: 'Present', timeIn: '08:20 AM' },
                { date: 'Oct 22, 2025', day: 'Sunday', status: 'Absent', timeIn: '-' },
                { date: 'Oct 21, 2025', day: 'Saturday', status: 'Absent', timeIn: '-' },
            ],
            assignments: [
                { course: 'Data Structures', code: 'CS-301', sections: ['A', 'B'], status: 'Active' },
                { course: 'Algorithms', code: 'CS-303', sections: ['C'], status: 'Active' },
                { course: 'Advanced Programming', code: 'CS-401', sections: ['A'], status: 'Active' },
                { course: 'Advanced Programming', code: 'CS-401', sections: ['A'], status: 'Active' },
                { course: 'Advanced Programming', code: 'CS-401', sections: ['A'], status: 'Active' },
                { course: 'Advanced Programming', code: 'CS-401', sections: ['A'], status: 'Active' },
                { course: 'Advanced Programming', code: 'CS-401', sections: ['A'], status: 'Active' },
            ]
        },
        {
            id: 2, name: 'Sarah Wilson', email: 'sarah@uni.edu', phone: '+1 555-0102', status: 'Active',
            attendance: 88,
            attendanceLogs: [
                { date: 'Oct 28, 2025', day: 'Monday', status: 'Present', timeIn: '08:25 AM' },
                { date: 'Oct 27, 2025', day: 'Friday', status: 'Absent', timeIn: '-' },
                { date: 'Oct 26, 2025', day: 'Thursday', status: 'Present', timeIn: '08:30 AM' },
                { date: 'Oct 25, 2025', day: 'Wednesday', status: 'Present', timeIn: '08:22 AM' },
            ],
            assignments: [
                { course: 'Web Development', code: 'CS-302', sections: ['A', 'B', 'C'], status: 'Active' },
                { course: 'Mobile App Dev', code: 'CS-405', sections: ['A'], status: 'Inactive' }
            ]
        },
    ]);

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCourses = selectedTeacher?.assignments.length || 0;
    const totalSections = selectedTeacher?.assignments.reduce((acc, curr) => acc + curr.sections.length, 0) || 0;

    const columns = [
        {
            key: 'name',
            label: 'Teacher Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                </div>
            )
        },
        { key: 'email', label: 'Email' },
        {
            key: 'attendance',
            label: 'Attendance (Oct)',
            render: (row) => (
                <button
                    onClick={() => setAttendanceTeacher(row)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${row.attendance >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : row.attendance >= 70
                                ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {row.attendance}%
                </button>
            )
        },
        {
            key: 'assignments',
            label: 'Courses & Sections',
            render: (row) => (
                <button
                    onClick={() => setSelectedTeacher(row)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    {row.assignments.length} Courses
                </button>
            )
        },
        {
            key: 'status', label: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {row.status}
                </span>
            ),
        },
    ];

    return (
        <Layout title="Teachers" subtitle="Manage teachers, view courses, and track attendance">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80 p-2">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
                        <Plus className="w-4 h-4" /> Add Teacher
                    </button>
                </div>

                <DataTable columns={columns} data={filteredTeachers} itemsPerPage={5} />
            </div>

            {/* ========================================================= */}
            {/* 👇 MODAL 1: RESPONSIVE COURSE ASSIGNMENTS 👇 */}
            {/* ========================================================= */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh] md:h-[550px]">

                        {/* Left Sidebar: Teacher Info & Stats */}
                        <div className="w-full md:w-1/3 bg-slate-800 p-6 text-white flex flex-col shrink-0 relative">
                            <button onClick={() => setSelectedTeacher(null)} className="md:hidden absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full z-10">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6 mt-4 md:mt-0">
                                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm mb-3">
                                    {selectedTeacher.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold">{selectedTeacher.name}</h2>
                                <p className="text-slate-300 text-sm">{selectedTeacher.email}</p>
                            </div>

                            <div className="flex md:flex-col gap-3 mt-auto overflow-x-auto pb-2 md:pb-0">
                                <div className="bg-white/10 rounded-xl p-3 flex flex-1 md:flex-none items-center gap-3 shrink-0">
                                    <div className="w-10 h-10 bg-indigo-500/30 text-indigo-200 rounded-lg flex items-center justify-center shrink-0">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Courses</p>
                                        <p className="text-xl font-bold leading-tight">{totalCourses}</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 flex flex-1 md:flex-none items-center gap-3 shrink-0">
                                    <div className="w-10 h-10 bg-emerald-500/30 text-emerald-200 rounded-lg flex items-center justify-center shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Sections Taught</p>
                                        <p className="text-xl font-bold leading-tight">{totalSections}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content: Courses List */}
                        <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
                            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm hidden md:block">Assigned Courses</h3>
                                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm md:hidden">Assigned Courses</h3>
                                <button onClick={() => setSelectedTeacher(null)} className="hidden md:block p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 md:p-6 overflow-y-auto space-y-3 md:space-y-4 bg-white flex-1">
                                {selectedTeacher.assignments.map((item, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">{item.course}</p>
                                                <p className="text-sm font-semibold text-indigo-600">{item.code}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sections</p>
                                                <div className="flex gap-1.5">
                                                    {item.sections.map(sec => (
                                                        <span key={sec} className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-700 text-xs font-bold rounded-md border border-slate-200">
                                                            {sec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide inline-block ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 👇 MODAL 2: RESPONSIVE ATTENDANCE LOGS 👇 */}
            {/* ========================================================= */}
            {attendanceTeacher && (
                <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh] md:h-[550px]">

                        {/* Left Sidebar: Summary */}
                        <div className="w-full md:w-1/3 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white flex flex-col shrink-0 relative">
                            <button onClick={() => setAttendanceTeacher(null)} className="md:hidden absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full z-10">
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6 mt-4 md:mt-0">
                                <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-3">
                                    <CalendarCheck className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold">Attendance Record</h2>
                                <p className="text-emerald-100 text-sm">{attendanceTeacher.name}</p>
                            </div>

                            <div className="bg-white/10 rounded-2xl p-5 text-center mt-auto backdrop-blur-sm border border-white/20">
                                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">October Average</p>
                                <p className="text-4xl md:text-5xl font-black">{attendanceTeacher.attendance}%</p>
                            </div>
                        </div>

                        {/* Right Content: Daily Logs */}
                        <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
                            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Daily Breakdown</h3>
                                <button onClick={() => setAttendanceTeacher(null)} className="hidden md:block p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 md:p-6 overflow-y-auto bg-white flex-1">
                                <div className="grid grid-cols-1 gap-3">
                                    {attendanceTeacher.attendanceLogs.map((log, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-3 sm:gap-0">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${log.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                                        log.status === 'Late' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-red-50 text-red-600'
                                                    }`}>
                                                    {log.status === 'Present' ? <CheckCircle className="w-6 h-6" /> :
                                                        log.status === 'Late' ? <Clock className="w-6 h-6" /> :
                                                            <XCircle className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{log.date}</p>
                                                    <p className="text-sm text-gray-500">{log.day}</p>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Time In</p>
                                                    <p className="text-sm font-bold text-gray-700">{log.timeIn}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                                        log.status === 'Late' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default AdminTeachers;