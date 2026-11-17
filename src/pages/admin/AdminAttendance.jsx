import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Filter, BookOpen, Loader2, ShieldAlert, Lock, Unlock,
    Eye, CheckCircle, XCircle, Search, ChevronRight, Calendar
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const AdminAttendance = () => {
    // Dropdowns
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [semesters, setSemesters] = useState([]);

    // Selections
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // Data
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    // Expanded Course View
    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [courseWeeks, setCourseWeeks] = useState([]);
    const [loadingWeeks, setLoadingWeeks] = useState(false);

    // Attendance Records View
    const [viewRecordsCourse, setViewRecordsCourse] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedWeekFilter, setSelectedWeekFilter] = useState('');
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [progRes, batchRes, semRes] = await Promise.all([
                    api.get('/programs'), api.get('/batches'), api.get('/semesters')
                ]);
                setPrograms(progRes.data);
                setBatches(batchRes.data);
                setSemesters(semRes.data);
                if (progRes.data.length > 0) setSelectedProgram(progRes.data[0].id);
                if (batchRes.data.length > 0) setSelectedBatch(batchRes.data[0].id);
                if (semRes.data.length > 0) setSelectedSemester(semRes.data[0].id);
            } catch (error) { console.error(error); }
        };
        fetchDropdowns();
    }, []);

    const fetchCourses = async () => {
        if (!selectedProgram || !selectedBatch || !selectedSemester) return;
        setLoading(true);
        try {
            const res = await api.get(`/admin-attendance/config?programId=${selectedProgram}&batchId=${selectedBatch}&semesterId=${selectedSemester}`);
            setCourses(res.data);
            setExpandedCourseId(null);
            setViewRecordsCourse(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, [selectedProgram, selectedBatch, selectedSemester]);

    const toggleCourseExpand = async (course) => {
        if (expandedCourseId === course.programCourseId) {
            setExpandedCourseId(null);
            return;
        }
        setExpandedCourseId(course.programCourseId);
        setViewRecordsCourse(null);
        setLoadingWeeks(true);
        try {
            const res = await api.get(`/admin-attendance/weeks?programCourseId=${course.programCourseId}`);
            setCourseWeeks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingWeeks(false);
        }
    };

    const handleToggleWeek = async (course, week, currentStatus) => {
        try {
            await api.put('/admin-attendance/toggle-week', {
                programCourseId: course.programCourseId,
                weekNumber: week.weekNumber,
                isAllowed: !currentStatus
            });
            // Refresh weeks
            const res = await api.get(`/admin-attendance/weeks?programCourseId=${course.programCourseId}`);
            setCourseWeeks(res.data);
        } catch (error) {
            alert("Failed to update week restriction");
        }
    };

    const handleToggleGlobalLock = async (course) => {
        if (!window.confirm(`Are you sure you want to ${course.isGlobalLocked ? 'unlock' : 'lock'} attendance for ${course.courseCode}? This affects ALL sections.`)) return;
        try {
            await api.put('/admin-attendance/toggle-global-lock', {
                programCourseId: course.programCourseId,
                isLocked: !course.isGlobalLocked
            });
            fetchCourses(); // Refresh course list
        } catch (error) {
            alert("Failed to update global lock");
        }
    };

    const handleViewRecords = async (course, weekFilter = '') => {
        setViewRecordsCourse(course);
        setExpandedCourseId(null);
        setSelectedWeekFilter(weekFilter);
        setLoadingRecords(true);
        try {
            const url = weekFilter
                ? `/admin-attendance/records?programCourseId=${course.programCourseId}&week=${weekFilter}`
                : `/admin-attendance/records?programCourseId=${course.programCourseId}`;
            const res = await api.get(url);
            setAttendanceRecords(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingRecords(false);
        }
    };

    const filteredRecords = attendanceRecords.filter(r =>
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout title="Attendance Management" subtitle="Manage restrictions and view attendance records">
            <div className="space-y-6 pb-8 max-w-7xl mx-auto">

                {/* Global Filters */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold">
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                {viewRecordsCourse ? (
                    // Attendance Records View
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
                        <div className="p-5 border-b border-gray-200 bg-slate-800 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Attendance Records: {viewRecordsCourse.courseCode}</h2>
                                <p className="text-xs text-slate-300">Viewing all marked attendance</p>
                            </div>
                            <button onClick={() => setViewRecordsCourse(null)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold">
                                Close Records
                            </button>
                        </div>

                        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search student..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
                            </div>
                            <select value={selectedWeekFilter} onChange={(e) => handleViewRecords(viewRecordsCourse, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold">
                                <option value="">All Weeks</option>
                                {[...Array(14)].map((_, i) => <option key={i + 1} value={i + 1}>Week {i + 1}</option>)}
                            </select>
                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-3">Student</th>
                                    <th className="px-6 py-3">Section</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loadingRecords ? (
                                    <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" /></td></tr>
                                ) : filteredRecords.length === 0 ? (
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-500">No records found.</td></tr>
                                ) : (
                                    filteredRecords.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{r.studentName}</p>
                                                <p className="text-xs text-gray-500">{r.rollNo}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{r.section}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${r.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 italic">{r.remarks || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Course List & Restrictions View
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Manage Restrictions</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
                            ) : courses.map(course => (
                                <div key={course.programCourseId} className="bg-white">
                                    <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-lg">{course.courseCode} - {course.courseName}</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {course.isGlobalLocked ? (
                                                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Globally Locked</span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><Unlock className="w-3 h-3" /> Unlocked</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                            <button
                                                onClick={() => handleToggleGlobalLock(course)}
                                                className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 border ${course.isGlobalLocked
                                                        ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                        : 'border-red-200 text-red-700 hover:bg-red-50'
                                                    }`}
                                            >
                                                {course.isGlobalLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                {course.isGlobalLocked ? 'Unlock All' : 'Lock All'}
                                            </button>

                                            <button
                                                onClick={() => handleViewRecords(course)}
                                                className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg hover:bg-blue-100 flex items-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" /> Records
                                            </button>

                                            <button
                                                onClick={() => toggleCourseExpand(course)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 flex items-center gap-2"
                                            >
                                                Weeks <ChevronRight className={`w-4 h-4 transition-transform ${expandedCourseId === course.programCourseId ? 'rotate-90' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Weeks Grid */}
                                    {expandedCourseId === course.programCourseId && (
                                        <div className="p-6 bg-slate-50 border-t border-gray-100">
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Restrict Weeks for this Course (Applies to all sections)</h3>
                                            {loadingWeeks ? (
                                                <div className="flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-indigo-600" /></div>
                                            ) : (
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                    {courseWeeks.map(w => (
                                                        <button
                                                            key={w.weekNumber}
                                                            onClick={() => handleToggleWeek(course, w, w.isAllowed)}
                                                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${w.isAllowed
                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300'
                                                                    : 'bg-red-50 border-red-200 text-red-700 hover:border-red-300'
                                                                }`}
                                                        >
                                                            <span className="text-xs font-bold uppercase mb-1">Week {w.weekNumber}</span>
                                                            {w.isAllowed ? <CheckCircle className="w-5 h-5 mb-1" /> : <XCircle className="w-5 h-5 mb-1" />}
                                                            <span className="text-[10px] font-bold">{w.isAllowed ? 'Allowed' : 'Restricted'}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminAttendance;