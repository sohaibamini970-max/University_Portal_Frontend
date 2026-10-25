import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Users, BookOpen, CheckCircle, Save, CheckSquare, XSquare,
    ShieldCheck, X, Award, Search
} from 'lucide-react';

const MarkAttendance = () => {
    const [selectedCourse, setSelectedCourse] = useState('CS-301');
    const [selectedSection, setSelectedSection] = useState('A');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const courseData = {
        'CS-301': {
            name: 'Data Structures',
            sections: {
                A: [
                    { id: 1, name: 'Ali Hassan', rollNo: '5950/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 2, name: 'Zainab Khan', rollNo: '5951/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 3, name: 'Hamza Ahmed', rollNo: '5952/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 4, name: 'Fatima Noor', rollNo: '5953/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 5, name: 'Usman Raza', rollNo: '5954/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                ],
                B: [
                    { id: 6, name: 'Bilal Tariq', rollNo: '5960/BCS/2024F', section: 'B', batch: '2024-2028', present: true },
                    { id: 7, name: 'Ayesha Malik', rollNo: '5961/BCS/2024F', section: 'B', batch: '2024-2028', present: true },
                    { id: 8, name: 'Omer Farooq', rollNo: '5962/BCS/2024F', section: 'B', batch: '2024-2028', present: true },
                ]
            }
        },
        'CS-302': {
            name: 'Web Development',
            sections: {
                A: [
                    { id: 9, name: 'Ali Hassan', rollNo: '5950/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 10, name: 'Zainab Khan', rollNo: '5951/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                    { id: 11, name: 'Hamza Ahmed', rollNo: '5952/BCS/2024F', section: 'A', batch: '2024-2028', present: true },
                ]
            }
        }
    };

    const [students, setStudents] = useState(() => {
        return courseData[selectedCourse].sections[selectedSection];
    });

    const handleClassChange = (course, section) => {
        setSelectedCourse(course);
        setSelectedSection(section);
        setSearchQuery('');
        const newStudents = courseData[course].sections[section] || [];
        setStudents(newStudents.map(s => ({ ...s, present: true })));
    };

    const toggleAttendance = (id) => {
        setStudents(prev => prev.map(student =>
            student.id === id ? { ...student, present: !student.present } : student
        ));
    };

    const filteredStudents = students.filter(student =>
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const markAll = (status) => {
        const filteredIds = filteredStudents.map(s => s.id);
        setStudents(prev => prev.map(s =>
            filteredIds.includes(s.id) ? { ...s, present: status } : s
        ));
    };

    const handleSubmit = () => {
        setShowSuccessPopup(true);
    };

    const totalStudents = students.length;
    const presentCount = students.filter(s => s.present).length;
    const absentCount = totalStudents - presentCount;

    const isAllPresent = filteredStudents.length > 0 && filteredStudents.every(s => s.present);
    const isAllAbsent = filteredStudents.length > 0 && filteredStudents.every(s => !s.present);

    return (
        <Layout title="Mark Attendance" subtitle="Record daily student attendance">
            <div className="space-y-6 pb-8">

                {/* 1. Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Courses</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900">04</p>
                            <p className="text-sm text-blue-600 mt-1">Assigned to you</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Total Sections</p>
                                <p className="text-3xl font-bold mt-1">06</p>
                                <p className="text-sm opacity-75 mt-1">Across all courses</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Credit Hours</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900">16</p>
                            <p className="text-sm text-emerald-600 mt-1">This semester</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Main Attendance Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Header & Dropdowns */}
                    <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Attendance Sheet</h2>
                                <p className="text-sm text-gray-500">Select class to begin marking.</p>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <select
                                value={selectedCourse}
                                onChange={(e) => handleClassChange(e.target.value, selectedSection)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
                            >
                                <option value="CS-301">CS-301: Data Structures</option>
                                <option value="CS-302">CS-302: Web Development</option>
                            </select>

                            <select
                                value={selectedSection}
                                onChange={(e) => handleClassChange(selectedCourse, e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer w-full sm:w-auto"
                            >
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                            </select>
                        </div>
                    </div>

                    {/* Quick Actions & Search Toolbar */}
                    <div className="px-5 py-4 border-b border-gray-100 flex flex-col xl:flex-row items-center justify-between gap-4 bg-gray-50">

                        {/* 👇 Search + Students tag grouped together 👇 */}
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Roll No or Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Students badge on right of search */}
                            <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-2 py-2 rounded-lg border border-indigo-200 whitespace-nowrap">
                                {totalStudents} Students
                            </span>
                        </div>

                        {/* Mark All Toggles */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                            <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-start">
                                <input
                                    type="checkbox"
                                    checked={isAllPresent}
                                    onChange={() => markAll(true)}
                                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                                />
                                <span className="text-xs font-bold text-gray-700">Mark All Present</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-start">
                                <input
                                    type="checkbox"
                                    checked={isAllAbsent}
                                    onChange={() => markAll(false)}
                                    className="w-4 h-4 text-red-600 rounded accent-red-600"
                                />
                                <span className="text-xs font-bold text-gray-700">Mark All Absent</span>
                            </label>
                        </div>
                    </div>

                    {/* Table Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 bg-indigo-600 text-slate-200 text-xs font-bold uppercase tracking-wider p-4">
                        <div className="col-span-4 pl-2">Student Name</div>
                        <div className="col-span-3 pl-2">Roll No</div>
                        <div className="col-span-2 text-center">Batch</div>
                        <div className="col-span-1 text-center">Section</div>
                        <div className="col-span-2 text-center">Attendance</div>
                    </div>

                    {/* Student List */}
                    <div className="divide-y divide-gray-100">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className={`p-4 md:px-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:items-center transition-colors ${student.present ? 'bg-white hover:bg-emerald-50/30' : 'bg-red-50/30 hover:bg-red-50/50'}`}
                                >
                                    <div className="md:col-span-4 md:pl-2">
                                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                    </div>

                                    <div className="md:col-span-3 md:pl-2 flex justify-between md:block">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Roll No:</span>
                                        <p className="text-sm text-gray-600 font-semibold">{student.rollNo}</p>
                                    </div>

                                    <div className="md:col-span-2 text-center flex justify-between md:block">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Batch:</span>
                                        <p className="text-sm text-gray-700 font-medium">{student.batch}</p>
                                    </div>

                                    <div className="md:col-span-1 text-center flex justify-between md:block">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Section:</span>
                                        <p className="text-sm text-gray-700 font-bold">{student.section}</p>
                                    </div>

                                    <div className="md:col-span-2 flex items-center justify-end md:justify-center gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
                                        <button
                                            onClick={() => { if (!student.present) toggleAttendance(student.id); }}
                                            className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${student.present ? 'text-blue-600 bg-blue-50' : 'text-gray-300 hover:text-blue-400 hover:bg-gray-100'}`}
                                        >
                                            <CheckSquare className="w-6 h-6" />
                                        </button>

                                        <button
                                            onClick={() => { if (student.present) toggleAttendance(student.id); }}
                                            className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${!student.present ? 'text-red-600 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-gray-100'}`}
                                        >
                                            <XSquare className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                No students found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Response / Remarks Box */}
                    <div className="p-5 md:p-6 bg-slate-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <label className="block text-sm font-bold text-gray-700">
                                Teacher's Remarks (Optional)
                            </label>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-max">
                                {presentCount} Present / {absentCount} Absent
                            </span>
                        </div>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter any notes about today's attendance..."
                            rows="3"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        ></textarea>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleSubmit}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                            >
                                <Save className="w-4 h-4" /> Submit Attendance
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* SUCCESS POPUP MODAL */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-300 text-center p-6">
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Attendance Marked!</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            You have successfully recorded attendance for <strong>{courseData[selectedCourse].name} (Sec {selectedSection})</strong>.<br /><br />
                            <span className="text-blue-600 font-bold">{presentCount} Present</span> | <span className="text-red-600 font-bold">{absentCount} Absent</span>
                        </p>

                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default MarkAttendance;