import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    CheckCircle, Save, CheckSquare, XSquare, ShieldCheck,
    Search, Loader2, BookOpen, Clock, AlertCircle, Lock
} from 'lucide-react';
import { api } from '../../context/AuthContext';

const MarkAttendance = () => {
    // 1. Teacher Courses
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loadingCourses, setLoadingCourses] = useState(true);

    // 2. Dates & Weeks
    const [classDates, setClassDates] = useState([]);
    const [availableWeeks, setAvailableWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState('');
    const [filteredDatesForWeek, setFilteredDatesForWeek] = useState([]);
    const [selectedDateData, setSelectedDateData] = useState(null);

    // 3. Students & Attendance
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch initial courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/attendance/teacher-courses');
                setCourses(res.data);
                if (res.data.length > 0) setSelectedCourse(res.data[0].id);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    // Fetch class dates when course changes
    useEffect(() => {
        const fetchDates = async () => {
            if (!selectedCourse) return;
            try {
                const res = await api.get(`/attendance/class-dates?teacherAssignmentId=${selectedCourse}`);
                setClassDates(res.data);

                // Extract unique weeks
                const weeks = [...new Set(res.data.map(d => d.weekNumber))].sort((a, b) => a - b);
                setAvailableWeeks(weeks);

                // Auto-select first week
                if (weeks.length > 0) {
                    setSelectedWeek(weeks[0]);
                } else {
                    setSelectedWeek('');
                    setFilteredDatesForWeek([]);
                    setSelectedDateData(null);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchDates();
    }, [selectedCourse]);

    // Filter dates when week changes
    useEffect(() => {
        if (!selectedWeek) return;
        const datesForWeek = classDates.filter(d => d.weekNumber === selectedWeek);
        setFilteredDatesForWeek(datesForWeek);

        // Auto-select the first class in the week
        if (datesForWeek.length > 0) {
            setSelectedDateData(datesForWeek[0]);
        } else {
            setSelectedDateData(null);
        }
    }, [selectedWeek, classDates]);

    // Fetch students when date is selected
    useEffect(() => {
        const fetchStudents = async () => {
            if (!selectedCourse || !selectedDateData) return;
            setLoadingStudents(true);
            setErrorMessage('');
            try {
                const res = await api.get(
                    `/attendance/class-students?teacherAssignmentId=${selectedCourse}` +
                    `&academicCalendarId=${selectedDateData.id}`
                );
                setStudents(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingStudents(false);
            }
        };
        fetchStudents();
    }, [selectedCourse, selectedDateData]);

    const toggleAttendance = (id) => {
        setStudents(prev => prev.map(student =>
            student.id === id ? { ...student, isPresent: !student.isPresent } : student
        ));
    };

    const markAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, isPresent: status })));
    };

    const handleSubmit = async () => {
        if (!selectedDateData) return;

        if (!selectedDateData.isAttendanceAllowed) {
            return setErrorMessage("Attendance for this week is restricted by the Admin.");
        }

        setIsSubmitting(true);
        setErrorMessage('');
        try {
            await api.post('/attendance/mark', {
                teacherAssignmentId: parseInt(selectedCourse),
                academicCalendarId: selectedDateData.id,   // ← NEW
                date: selectedDateData.date,
                remarks,
                students: students.map(s => ({
                    studentProfileId: s.id,
                    isPresent: s.isPresent
                }))
            });
            setShowSuccessPopup(true);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to save attendance");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const presentCount = students.filter(s => s.isPresent).length;
    const absentCount = students.length - presentCount;

    const currentCourseInfo = courses.find(c => c.id === selectedCourse);

    if (loadingCourses) return <Layout title="Mark Attendance"><div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Mark Attendance" subtitle="Select a course, pick the week, and mark attendance">
            <div className="space-y-6 pb-8 max-w-5xl mx-auto">

                {/* Control Panel (Dropdowns) */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Select Class Details</h2>
                            <p className="text-sm text-gray-500">Choose the course, week, and specific date.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Course Dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Course & Section</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.courseCode} - {c.courseName} (Sec {c.section})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Week Dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Week</label>
                            <select
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                                disabled={availableWeeks.length === 0}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                            >
                                {availableWeeks.length === 0 && <option value="">No weeks available</option>}
                                {availableWeeks.map(w => (
                                    <option key={w} value={w}>Week {w}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Class Date Dropdown */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class Date</label>
                            <select
                                value={selectedDateData?.id || ''}
                                onChange={(e) => {
                                    const dt = filteredDatesForWeek.find(d => d.id === Number(e.target.value));
                                    setSelectedDateData(dt);
                                }}
                                disabled={filteredDatesForWeek.length === 0}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                            >
                                {filteredDatesForWeek.length === 0 && <option value="">No dates available</option>}
                                {filteredDatesForWeek.map(d => (
                                    // <option key={d.id} value={d.id}>
                                    //     Class {d.classNumber} -
                                    //     {new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ({d.dayName})
                                    // </option>
                                    <option key={d.id} value={d.id}>
                                        Wk {d.weekNumber} · Class {d.classNumber}
                                        {d.timeSlot ? ` · ${d.timeSlot}` : ''}
                                        {' · '}{new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {currentCourseInfo && (
                        <div className="flex flex-wrap gap-3 text-xs font-medium text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {currentCourseInfo.programName} ({currentCourseInfo.batchName})</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {currentCourseInfo.semesterName}</span>
                        </div>
                    )}
                </div>

                {/* Attendance Area */}
                {selectedDateData && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">

                        {!selectedDateData.isAttendanceAllowed ? (
                            // Restricted View
                            <div className="p-10 text-center flex flex-col items-center bg-red-50">
                                <Lock className="w-12 h-12 text-red-500 mb-3" />
                                <h3 className="text-xl font-bold text-red-700">Attendance Restricted</h3>
                                <p className="text-sm text-red-600 mt-1">The Admin has restricted attendance marking for this specific week.</p>
                            </div>
                        ) : (
                            // Marking View
                            <>
                                <div className="p-5 border-b border-gray-200 bg-gray-800 text-white flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-bold">Mark Attendance</h2>
                                        <p className="text-xs text-indigo-100">Week {selectedDateData.weekNumber} • Class {selectedDateData.classNumber} • {new Date(selectedDateData.date).toDateString()}</p>
                                    </div>
                                </div>

                                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-gray-50">
                                    <div className="relative w-full md:w-72">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => markAll(true)} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-sm hover:bg-emerald-100">Mark All Present</button>
                                        <button onClick={() => markAll(false)} className="px-4 py-2 bg-red-50 text-red-700 font-bold rounded-lg text-sm hover:bg-red-100">Mark All Absent</button>
                                    </div>
                                </div>

                                {loadingStudents ? (
                                    <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
                                ) : (
                                    <>
                                        <div className="max-h-[500px] overflow-y-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-indigo-600 text-white uppercase text-xs sticky top-0">
                                                    <tr>
                                                        <th className="px-4 py-3 font-bold">Student Name</th>
                                                        <th className="px-4 py-3 font-bold">Roll No.</th>
                                                        <th className="px-4 py-3 font-bold text-center">Total Absents</th>
                                                        <th className="px-4 py-3 font-bold text-center">Attendance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredStudents.map(student => (
                                                        <tr key={student.id} className={student.isPresent ? 'hover:bg-emerald-50' : 'bg-red-50'}>
                                                            <td className="px-4 py-3 font-bold text-gray-900">{student.name}</td>
                                                            <td className="px-4 py-3 text-gray-500">{student.rollNo}</td>
                                                            <td className="px-4 py-3 text-center font-semibold text-gray-700">
                                                                {student.totalAttendedClasses ?? 0}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-center gap-2">
                                                                    <button onClick={() => toggleAttendance(student.id)} aria-label={`Mark ${student.name} present`} className={`p-2 rounded-lg transition-colors ${student.isPresent ? 'text-emerald-600 bg-emerald-100' : 'text-gray-400 bg-gray-100'}`}>
                                                                        <CheckSquare className="w-5 h-5" />
                                                                    </button>
                                                                    <button onClick={() => toggleAttendance(student.id)} aria-label={`Mark ${student.name} absent`} className={`p-2 rounded-lg transition-colors ${!student.isPresent ? 'text-red-600 bg-red-100' : 'text-gray-400 bg-gray-100'}`}>
                                                                        <XSquare className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {filteredStudents.length === 0 && (
                                                        <tr>
                                                            <td colSpan="4" className="p-8 text-center text-gray-500">No students found.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="p-5 bg-slate-50 border-t border-gray-200">
                                            {errorMessage && <div className="mb-4 text-red-600 text-sm font-bold text-center">{errorMessage}</div>}
                                            <textarea
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Add optional remarks for this class..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm mb-4"
                                                rows="2"
                                            ></textarea>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-gray-600">{presentCount} Present / {absentCount} Absent</span>
                                                <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-md">
                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    Submit Attendance
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center p-6">
                        <ShieldCheck className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                        <p className="text-gray-500 mb-6">Attendance saved successfully.</p>
                        <button onClick={() => setShowSuccessPopup(false)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Done</button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default MarkAttendance;
