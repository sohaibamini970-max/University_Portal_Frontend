import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import {
    BookOpen, Users, ClipboardList, Save, ShieldCheck, X, Search, Award
} from 'lucide-react';

const Assessments = () => {
    const [selectedCourse, setSelectedCourse] = useState('CS-301');
    const [selectedSection, setSelectedSection] = useState('A');
    const [assessmentType, setAssessmentType] = useState('Quiz 1');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const courseData = {
        'CS-301': {
            name: 'Data Structures',
            totalMarks: 100,
            sections: {
                A: [
                    { id: 1, name: 'Ali Hassan', rollNo: '5950/BCS/2024F', section: 'A', marks: '' },
                    { id: 2, name: 'Zainab Khan', rollNo: '5951/BCS/2024F', section: 'A', marks: '' },
                    { id: 3, name: 'Hamza Ahmed', rollNo: '5952/BCS/2024F', section: 'A', marks: '' },
                    { id: 4, name: 'Fatima Noor', rollNo: '5953/BCS/2024F', section: 'A', marks: '' },
                    { id: 5, name: 'Usman Raza', rollNo: '5954/BCS/2024F', section: 'A', marks: '' },
                ],
                B: [
                    { id: 6, name: 'Bilal Tariq', rollNo: '5960/BCS/2024F', section: 'B', marks: '' },
                    { id: 7, name: 'Ayesha Malik', rollNo: '5961/BCS/2024F', section: 'B', marks: '' },
                    { id: 8, name: 'Omer Farooq', rollNo: '5962/BCS/2024F', section: 'B', marks: '' },
                ]
            }
        },
        'CS-302': {
            name: 'Web Development',
            totalMarks: 50,
            sections: {
                A: [
                    { id: 9, name: 'Ali Hassan', rollNo: '5950/BCS/2024F', section: 'A', marks: '' },
                    { id: 10, name: 'Zainab Khan', rollNo: '5951/BCS/2024F', section: 'A', marks: '' },
                    { id: 11, name: 'Hamza Ahmed', rollNo: '5952/BCS/2024F', section: 'A', marks: '' },
                ]
            }
        }
    };

    const assessmentTypes = [
        'Quiz 1', 'Quiz 2', 'Quiz 3',
        'Assignment 1', 'Assignment 2', 'Assignment 3',
        'Mid Term', 'Final Term'
    ];

    const [students, setStudents] = useState(() => {
        return courseData[selectedCourse].sections[selectedSection].map(s => ({ ...s }));
    });

    const currentTotalMarks = courseData[selectedCourse]?.totalMarks || 100;

    const handleClassChange = (course, section, type) => {
        if (course) setSelectedCourse(course);
        if (section) setSelectedSection(section);
        if (type) setAssessmentType(type);

        setSearchQuery('');

        const currentCourse = course || selectedCourse;
        const currentSection = section || selectedSection;

        const newStudents = courseData[currentCourse]?.sections[currentSection] || [];
        setStudents(newStudents.map(s => ({ ...s, marks: '' })));
    };

    const handleMarksChange = (id, value) => {
        if (value === '' || (Number(value) >= 0 && Number(value) <= currentTotalMarks)) {
            setStudents(prev => prev.map(student =>
                student.id === id ? { ...student, marks: value } : student
            ));
        }
    };

    const handleSubmit = () => {
        setShowSuccessPopup(true);
    };

    const filteredStudents = students.filter(student =>
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalStudents = students.length;
    const gradedStudents = students.filter(s => s.marks !== '').length;
    const averageMarks = gradedStudents > 0
        ? (students.reduce((sum, s) => sum + (Number(s.marks) || 0), 0) / gradedStudents).toFixed(1)
        : 0;

    return (
        <Layout title="Assessments & Grading" subtitle="Record student marks for quizzes, assignments, and exams">
            <div className="space-y-6 pb-8">

                {/* 1. Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Students</p>
                            <p className="text-3xl font-bold mt-1 text-gray-900">{totalStudents}</p>
                            <p className="text-sm text-blue-600 mt-1 font-medium">For Current Session</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">Graded</p>
                                <p className="text-3xl font-bold mt-1">{gradedStudents} <span className="text-lg opacity-70">/ {totalStudents}</span></p>
                                <p className="text-sm opacity-90 mt-1 font-medium">Students evaluated</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <ClipboardList className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Class Average</p>
                            <p className="text-3xl font-bold mt-1 text-emerald-600">{averageMarks} <span className="text-lg text-gray-400">/ {currentTotalMarks}</span></p>
                            <p className="text-sm text-emerald-600 mt-1 font-medium">Based on entered marks</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Main Assessment Container */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                    {/* Header & Dropdowns */}
                    <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Enter Marks</h2>
                                <p className="text-sm text-gray-500">Select class and assessment type.</p>
                            </div>
                        </div>

                        {/* 3 Dropdowns */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={selectedCourse}
                                onChange={(e) => handleClassChange(e.target.value, selectedSection, assessmentType)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                <option value="CS-301">CS-301: Data Structures</option>
                                <option value="CS-302">CS-302: Web Development</option>
                            </select>

                            <select
                                value={selectedSection}
                                onChange={(e) => handleClassChange(selectedCourse, e.target.value, assessmentType)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                            </select>

                            <select
                                value={assessmentType}
                                onChange={(e) => handleClassChange(selectedCourse, selectedSection, e.target.value)}
                                className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                {assessmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Actions & Search Toolbar */}
                    <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">

                        {/* 👇 Search + Students tag grouped together 👇 */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Roll No or Name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            {/* Students tag on right of search */}
                            <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-2 py-2 rounded-lg border border-indigo-200 whitespace-nowrap">
                                {totalStudents} Students
                            </span>
                        </div>

                        <div className="text-sm font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            Assessment: <span className="text-indigo-600">{assessmentType}</span>
                        </div>
                    </div>

                    {/* Table Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 bg-indigo-600 text-slate-200 text-sm font-bold uppercase tracking-wider p-4">
                        <div className="col-span-4 pl-2">Student Name</div>
                        <div className="col-span-3 pl-2">Roll No</div>
                        <div className="col-span-2 text-center">Total Marks</div>
                        <div className="col-span-3 text-center">Obtained Marks</div>
                    </div>

                    {/* Student List */}
                    <div className="divide-y divide-gray-100">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    className={`p-4 md:px-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:items-center transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                                >
                                    <div className="md:col-span-4 md:pl-2 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                    </div>

                                    <div className="md:col-span-3 md:pl-2 flex justify-between md:block">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Roll No:</span>
                                        <p className="text-sm text-gray-600 font-semibold">{student.rollNo}</p>
                                    </div>

                                    <div className="md:col-span-2 flex justify-between md:block md:text-center">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Total Marks:</span>
                                        <p className="text-sm font-bold text-gray-700">{currentTotalMarks}</p>
                                    </div>

                                    <div className="md:col-span-3 flex items-center justify-between md:justify-center">
                                        <span className="md:hidden text-xs text-gray-500 font-medium">Obtained:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max={currentTotalMarks}
                                            value={student.marks}
                                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                            placeholder="--"
                                            className="w-24 px-3 py-2 text-center font-bold text-gray-800 bg-white border border-gray-400 rounded-sm outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                No students found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Submit Action */}
                    <div className="p-5 md:p-6 bg-slate-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500 font-medium text-center md:text-left">
                            Make sure all marks are accurate. You can update them later if needed.
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save {assessmentType} Marks
                        </button>
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

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Marks Saved!</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            You have successfully recorded <strong>{assessmentType}</strong> marks for <strong>{courseData[selectedCourse].name} (Sec {selectedSection})</strong>.<br /><br />
                            <span className="text-indigo-600 font-bold">{gradedStudents}</span> students were graded.
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

export default Assessments;